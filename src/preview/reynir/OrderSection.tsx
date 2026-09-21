/**
 * Reynir bakari — the custom order configurator.
 *
 * CONCEPT: the page speaks in printed-menu language (editorial serif, dotted
 * price leaders). So the order form fills in a "pöntunarseðill", an order slip
 * that accumulates the same dotted-leader lines as the menu above it. Choosing
 * an option writes a line onto the slip; the slip is the running receipt.
 *
 * Desktop: choices left, slip sticky on the right (the asymmetry is functional,
 * the right column reacts to the left). Mobile: single column, with a slim
 * sticky total bar at the top of the section so the running price stays visible
 * while scrolling the options. Deliberately NOT a bottom-fixed bar, which would
 * collide with the preview chrome.
 *
 * Request-to-order, not checkout: no card is ever entered. Iceland has no
 * Stripe/Shopify Payments, and a custom cake has to be confirmed by a person
 * anyway, so the owner confirms by phone and the customer pays on collection.
 *
 * ALL PRODUCT AND PRICE DATA IS PLACEHOLDER — see order.ts.
 */

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useModalFocus } from './useModalFocus'
import type { Lang } from './data'
import {
  COMPANY_ORDERS_ENABLED,
  ORDER_ENDPOINT,
  ORDER_T,
  PHOTO_UPLOAD_ENABLED,
  PLACEHOLDER_DATA,
  compositionOf,
  freeTextChoices,
  isQuoteRequest,
  isk,
  needsPhoto,
  sizeChoiceOf,
  choicePriceOf,
  fromPriceOf,
  occasionsFor,
  extraUnitPrice,
  columnsFor,
  type OrderGroup,
  type OrderProduct,
  type OrderChoice,
} from './order'
import { BODY, DIM, DISPLAY, EASE, FAINT, GOLD, GOLD_LIGHT, GOLD_TEXT, HAIR, HAIR_SOFT, INK, INK_DEEP, IVORY } from './tokens'
import { useOrderText, useSiteContent } from './sanity'
import { bakeryDate, noticeAt, pickupSlots } from './availability'

const ORDER_CSS = `
  /* layout: functional split, the slip reacts to the choices */
  .rb-ord-grid { display:grid; grid-template-columns:minmax(0,1fr) 360px; gap:clamp(28px,4vw,64px); align-items:start; }
  /* The slip's column has to run the FULL height of the form, or sticky has
     nowhere to travel: with align-items:start the column hugged the slip
     (520px inside a 3000px form) and the running total scrolled away the
     moment anyone started choosing, which is the one thing it exists not to
     do. Stretch the column, not the slip. */
  .rb-ord-slipwrap { align-self:stretch; }

  .rb-ord-step { border-top:1px solid ${HAIR}; padding-top:18px; margin-top:clamp(30px,4.5vh,46px); }
  .rb-ord-steplabel { font-size:12px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:${GOLD}; }
  /* The numbered step head — the wizard-rail idea (21st "Wizard Steps",
     checkout breadcrumbs) set in this page's own editorial language: a serif
     numeral and a hairline instead of circles and checkmarks. The number is
     what makes the form legible as a SEQUENCE at a glance. */
  .rb-ord-stephead { display:flex; align-items:baseline; gap:14px;
    border-top:1px solid ${HAIR}; padding-top:20px; }
  .rb-ord-stepnum { font-family:${DISPLAY}; font-style:italic; font-size:26px; line-height:1;
    color:${GOLD_LIGHT}; min-width:36px; }
  /* ── the context bar: who + occasion, one slim row above the steps ── */
  .rb-ord-ctx { display:flex; align-items:flex-start; gap:clamp(18px,3vw,36px); flex-wrap:wrap;
    margin-top:26px; padding:16px 18px; border:1px solid ${HAIR_SOFT}; border-radius:4px;
    background:rgba(243,234,211,.02); }
  .rb-ord-ctx-field { display:flex; flex-direction:column; gap:8px; }
  .rb-ord-ctx-label { font-size:11px; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
    color:${FAINT}; }
  /* The bar is a slimmer register than the form below it, so both of its
     controls sit at 44px — previously the select was 52 and the toggle 42,
     side by side, which is most of why it read as broken. */
  /* The height comes from PADDING, never from a fixed height.
     Two goes at this were wrong. line-height:44px made Chrome render the
     closed value as sliced fragments — the "dots". Replacing it with
     height:44px + zero vertical padding still clipped the ascenders, because
     an appearance:none select does not centre its text inside a forced box;
     it lays the text out from the top of the content area and the fixed
     height crops it. Letting padding define the height removes the box that
     was doing the cropping: 9 + 24 line + 9 + 2 border lands at 44px, the
     same height as the toggle beside it, with the text sitting naturally. */
  /* Two classes deep on purpose: this block sits ABOVE the shared
     .rb-ord-input/.rb-ord-select rule in the stylesheet, so a single class
     loses the cascade to it and the padding here was being ignored. */
  .rb-ord-select.rb-ord-ctx-select { min-width:210px; height:auto; padding:9px 38px 9px 14px; }
  .rb-ord-seg { display:inline-flex; border:1px solid ${HAIR}; border-radius:4px; overflow:hidden; }
  .rb-ord-seg label { position:relative; }
  .rb-ord-seg label + label { border-left:1px solid ${HAIR}; }
  .rb-ord-seg input { position:absolute; inset:0; opacity:0; cursor:pointer; }
  .rb-ord-seg span { display:flex; align-items:center; height:42px; padding:0 18px; font-size:13.5px;
    color:${DIM}; transition:background .2s ${EASE}, color .2s ${EASE}; }
  .rb-ord-seg label[data-on="true"] span { background:rgba(200,168,119,.14); color:${GOLD_LIGHT}; }
  .rb-ord-seg input:focus-visible + span { outline:2px solid ${GOLD}; outline-offset:-2px; }

  /* Who is ordering. Two lanes, not a dropdown: it changes which fields appear. */
  .rb-ord-who { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:16px; }
  .rb-ord-wholane { display:flex; flex-direction:column; gap:5px; text-align:left; cursor:pointer;
    padding:15px 16px; border:1px solid ${HAIR}; border-radius:4px; background:rgba(243,234,211,.02);
    transition:border-color .22s ${EASE}, background .22s ${EASE}; }
  .rb-ord-wholane:hover { border-color:rgba(238,211,170,.4); background:rgba(243,234,211,.05); }
  .rb-ord-wholane[data-on="true"] { border-color:${GOLD}; background:rgba(200,168,119,.09); }
  .rb-ord-wholane input { position:absolute; opacity:0; width:1px; height:1px; pointer-events:none; }
  .rb-ord-wholane:has(input:focus-visible) { outline:2px solid ${GOLD}; outline-offset:3px; }
  .rb-ord-wholane-name { font-family:${DISPLAY}; font-size:18px; color:${IVORY}; line-height:1.2; }
  .rb-ord-wholane[data-on="true"] .rb-ord-wholane-name { color:${GOLD_LIGHT}; }
  .rb-ord-wholane-hint { font-size:12.5px; color:${DIM}; line-height:1.45; }

  /* quantity stepper */
  .rb-ord-qty { display:flex; align-items:center; gap:0; margin-top:8px;
    border:1px solid ${HAIR}; border-radius:4px; width:max-content; }
  .rb-ord-qty button { width:46px; height:46px; background:none; border:0; cursor:pointer; color:${IVORY};
    font-size:19px; line-height:1; transition:color .2s ${EASE}, background .2s ${EASE}; }
  .rb-ord-qty button:hover:not(:disabled) { color:${GOLD_LIGHT}; background:rgba(243,234,211,.05); }
  .rb-ord-qty button:disabled { opacity:.32; cursor:not-allowed; }
  .rb-ord-qty button:focus-visible { outline:2px solid ${GOLD}; outline-offset:-2px; }
  .rb-ord-qty-val { min-width:46px; text-align:center; font-family:${DISPLAY}; font-size:19px; color:${GOLD};
    font-variant-numeric:tabular-nums; }

  /* Product picker. FLEX, not grid, so the owner can add or remove a product in
     the CMS at any count without leaving a hole: a grid keeps empty cells in the
     last row (4 products = one stranded card beside two gaps), whereas wrapped
     flex + centred remainder reads as deliberate at 1, 2, 4, 5 or 7 products.
     max-width caps each card at a third so a short row never stretches. */
  /* A compact dock of cards side by side — not four posters.
     These were square-photo cards at a third of the row: in the order form's
     column four of them stacked 2x2 and ran close to a thousand pixels, a
     whole screen of pictures before the first question. The photo is now a
     shallow 5:3 band capped in height, the padding is tighter and the type a
     step down, so all four sit in one row and stay comparable at a glance. */
  .rb-ord-prods { display:grid; gap:10px; margin-top:16px;
    grid-template-columns:repeat(var(--prod-cols,4), minmax(0,1fr)); }
  /* The photograph IS the card. Name and price used to sit in a dark block
     beneath a letterboxed photo, which gave the picture a third of the card
     and a hard edge across the middle of it. Now the image fills the whole
     tile and the text rides on a scrim over its foot, so the cake is what you
     see and the words stay legible on top of it. */
  .rb-ord-prod { position:relative; display:block; aspect-ratio:4 / 5; text-align:left; cursor:pointer;
    padding:0; border:1px solid ${HAIR}; border-radius:4px; background:${INK};
    overflow:hidden;
    transition:border-color .22s ${EASE}, transform .16s ${EASE}; }
  /* Product photo. The card is built so this can be absent — a product added
     in the CMS before its picture exists simply renders the text card. */
  .rb-ord-prod-pic { position:absolute; inset:0; margin:0; overflow:hidden; background:${INK}; }
  /* The scrim lives on the picture, so a product with no photo simply has no
     scrim and its text still reads on the card's own ground. */
  .rb-ord-prod-pic::after { content:''; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(180deg, rgba(11,10,9,0) 38%, rgba(11,10,9,.62) 68%, rgba(11,10,9,.93) 100%); }
  .rb-ord-prod-pic img { width:100%; height:100%; object-fit:cover; display:block;
    filter:saturate(.96) brightness(.94); transition:transform .5s ${EASE}, filter .35s ${EASE}; }
  .rb-ord-prod:hover .rb-ord-prod-pic img { transform:scale(1.04); filter:saturate(1) brightness(1); }
  .rb-ord-prod[data-on="true"] .rb-ord-prod-pic img { filter:saturate(1) brightness(1); }
  .rb-ord-prod:hover { border-color:rgba(238,211,170,.4); }
  .rb-ord-prod:active { transform:scale(.99); }
  .rb-ord-prod[data-on="true"] { border-color:${GOLD}; }
  .rb-ord-prod-name { position:absolute; z-index:2; left:12px; right:12px; bottom:26px;
    font-family:${DISPLAY}; font-size:16.5px; line-height:1.15; color:${IVORY}; }
  .rb-ord-prod[data-on="true"] .rb-ord-prod-name { color:${GOLD_LIGHT}; }
  .rb-ord-prod-from { position:absolute; z-index:2; left:12px; right:12px; bottom:9px;
    font-size:12.5px; color:${DIM}; font-variant-numeric:tabular-nums; }
  /* z-index is load-bearing, not decoration: the product photo carries a
     filter, which gives it its own stacking context, and a stacking context
     with z-index:auto paints in the positioned layer in DOM order — putting
     the later <img> on top of this earlier absolute mark and hiding the
     selected state entirely. The ring behind it keeps the mark legible over
     a photograph rather than only over the dark card. */
  .rb-ord-prod-mark { position:absolute; z-index:2; top:10px; right:10px; width:17px; height:17px; border-radius:50%;
    border:1px solid rgba(238,211,170,.55); display:flex; align-items:center; justify-content:center;
    background:rgba(11,10,9,.45); box-shadow:0 0 0 3px rgba(11,10,9,.35);
    transition:border-color .2s ${EASE}, background .2s ${EASE}; }
  .rb-ord-prod[data-on="true"] .rb-ord-prod-mark { border-color:${GOLD}; background:${GOLD}; }
  .rb-ord-prod-mark svg { opacity:0; transform:scale(.6); transition:opacity .18s ${EASE}, transform .18s ${EASE}; }
  .rb-ord-prod[data-on="true"] .rb-ord-prod-mark svg { opacity:1; transform:none; }

  /* Option groups.
     MARGIN, never padding. A <legend> is laid out above the fieldset's content
     box, so padding-top pushes the QUESTION'S OWN help text and choices down
     while leaving the heading itself hard against the previous group. Every
     heading on the page was bound to the answer above it instead of to its own
     options, which is what made the spacing read as broken. Margin moves the
     whole fieldset, legend included. */
  .rb-ord-group { margin:32px 0 0; padding:0; border:0; }
  .rb-ord-groups > .rb-ord-group:first-child { margin-top:20px; }
  .rb-ord-legend { padding:0; width:100%; font-family:${DISPLAY}; font-size:clamp(19px,2vw,23px); color:${IVORY}; }
  /* The tag is pinned to the top RIGHT of the question, never set inline after
     it. Inline, it sat beside short headings and dropped onto its own line
     under long ones, so half the questions looked one way and half the other
     and the long ones ended with a stray word. Pinned, every question reads
     identically however the heading wraps. */
  .rb-ord-legend-row { display:flex; align-items:baseline; justify-content:space-between;
    gap:14px; width:100%; }
  .rb-ord-legend-text { flex:1 1 auto; min-width:0; }
  .rb-ord-tag { flex:none; }
  .rb-ord-help { font-size:13.5px; color:${DIM}; margin:6px 0 0; line-height:1.5; }
  .rb-ord-tag { font-family:${BODY}; font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    color:${FAINT}; white-space:nowrap; }

  .rb-ord-choices { display:grid; gap:8px; margin-top:14px; }
  .rb-ord-choice { position:relative; display:flex; align-items:baseline; gap:10px; cursor:pointer;
    min-height:48px; padding:12px 15px; border:1px solid ${HAIR_SOFT}; border-radius:4px;
    transition:border-color .2s ${EASE}, background .2s ${EASE}, transform .14s ${EASE}; }
  .rb-ord-choice:hover { border-color:rgba(238,211,170,.32); background:rgba(243,234,211,.03); }
  .rb-ord-choice:active { transform:scale(.995); }
  .rb-ord-choice[data-on="true"] { border-color:${GOLD}; background:rgba(200,168,119,.08); }
  .rb-ord-choice[data-off="true"] { opacity:.42; cursor:not-allowed; }
  .rb-ord-choice[data-off="true"]:hover { border-color:${HAIR_SOFT}; background:transparent; }
  /* the real input stays in the a11y tree and drives focus, but is not painted */
  .rb-ord-choice input, .rb-ord-prod input {
    position:absolute; opacity:0; width:1px; height:1px; margin:0; pointer-events:none; }
  .rb-ord-choice:has(input:focus-visible), .rb-ord-prod:has(input:focus-visible) {
    outline:2px solid ${GOLD}; outline-offset:3px; }
  .rb-ord-mark { flex:none; width:15px; height:15px; margin-top:3px; border:1px solid rgba(238,211,170,.45);
    display:flex; align-items:center; justify-content:center; transition:border-color .2s ${EASE}, background .2s ${EASE}; }
  .rb-ord-mark[data-shape="round"] { border-radius:50%; }
  .rb-ord-mark[data-shape="box"] { border-radius:3px; }
  .rb-ord-choice[data-on="true"] .rb-ord-mark { border-color:${GOLD}; background:${GOLD}; }
  .rb-ord-mark svg { opacity:0; transform:scale(.6); transition:opacity .18s ${EASE}, transform .18s ${EASE}; }
  .rb-ord-choice[data-on="true"] .rb-ord-mark svg { opacity:1; transform:none; }
  .rb-ord-choice-label { color:${IVORY}; font-size:15.5px; line-height:1.4; }
  .rb-ord-choice-note { display:block; font-size:12.5px; color:${DIM}; margin-top:4px; line-height:1.45; }
  .rb-ord-choice-price { margin-left:auto; padding-left:12px; font-size:14px; color:${GOLD}; white-space:nowrap;
    font-variant-numeric:tabular-nums; }
  .rb-ord-choice-price[data-free="true"] { color:${FAINT}; font-size:12.5px; }

  /* Size tiles. Eleven kransakaka sizes as full-width rows is a wall to scroll
     past; as tiles it is three tidy lines with every price still readable. The
     radio dot is dropped because the tile itself carries the selected state,
     and a dot inside a small tile is a bullet, not a control. */
  .rb-ord-choices[data-layout="grid"] { grid-template-columns:repeat(auto-fill, minmax(112px, 1fr)); gap:7px; }
  .rb-ord-choices[data-layout="grid"] .rb-ord-choice { flex-direction:column; align-items:flex-start;
    gap:3px; padding:12px 13px; }
  .rb-ord-choices[data-layout="grid"] .rb-ord-mark { display:none; }
  .rb-ord-choices[data-layout="grid"] .rb-ord-choice-label { font-size:15px; }
  .rb-ord-choices[data-layout="grid"] .rb-ord-choice-price { margin-left:0; padding-left:0;
    font-size:12.5px; letter-spacing:.01em; }
  /* Selection has to survive a colour-blind reader, so the tile also thickens
     its edge rather than only turning gold. */
  .rb-ord-choices[data-layout="grid"] .rb-ord-choice[data-on="true"] { box-shadow:inset 0 0 0 1px ${GOLD}; }
  /* A tile that opens a field would trap it in a narrow column. */
  .rb-ord-choices[data-layout="grid"] > div:has(.rb-ord-extra) { grid-column:1 / -1; }

  /* Size row: one control, and the price it produces sitting beside it at the
     size a price deserves. The dropdown carries the choosing; the number
     carries the meaning. */
  .rb-ord-sizerow { display:flex; align-items:center; gap:18px; margin-top:14px; flex-wrap:wrap; }
  .rb-ord-sizeselect { flex:1 1 190px; max-width:280px; margin:0; }
  .rb-ord-sizeprice { display:flex; flex-direction:column; gap:1px; min-width:0; }
  .rb-ord-sizeprice-num { font-family:${DISPLAY}; font-size:clamp(24px,3vw,31px); line-height:1.05;
    color:${GOLD}; font-variant-numeric:tabular-nums; white-space:nowrap; }
  .rb-ord-sizeprice-num[data-bump="true"] { animation:rb-ord-bump .34s ${EASE}; }
  .rb-ord-sizeprice-rate { font-size:12.5px; color:${FAINT}; letter-spacing:.02em; white-space:nowrap; }
  @media (prefers-reduced-motion: reduce) { .rb-ord-sizeprice-num[data-bump="true"] { animation:none; } }
  @media (max-width: 560px) {
    /* Stacking keeps the number full size rather than squeezing it next to a
       control that already wants the whole width. */
    .rb-ord-sizerow { gap:12px; }
    .rb-ord-sizeselect { flex:1 1 100%; max-width:none; }
  }
  /* The field a choice opens. Indented under its row and sharing the row's
     gold edge, so it reads as part of that choice rather than a new question. */
  /* Indent matches the choice above it: the rule sits under the row's own left
     padding (15px) and the text lands where the label starts (15 + 15px mark +
     10px gap), so the answer sits under the question rather than beside it. */
  .rb-ord-extra { margin:8px 0 2px 15px; padding-left:25px; border-left:2px solid rgba(200,168,119,.34);
    animation:rb-ord-extrain .32s ${EASE} both; }
  @keyframes rb-ord-extrain { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }

  /* Photo upload. The dashed edge says "drop something here" without pretending
     to be a drop zone the phone cannot use, and it stays clearly secondary to
     the choice it belongs to. */
  .rb-ord-photo { margin-top:12px; }
  .rb-ord-photo-pick { display:flex; align-items:center; gap:12px; cursor:pointer;
    padding:13px 15px; border:1px dashed rgba(238,211,170,.34); border-radius:4px;
    background:rgba(243,234,211,.02); transition:border-color .2s ${EASE}, background .2s ${EASE}; }
  .rb-ord-photo-pick:hover { border-color:${GOLD}; background:rgba(200,168,119,.06); }
  .rb-ord-photo-pick input { position:absolute; opacity:0; width:1px; height:1px; pointer-events:none; }
  .rb-ord-photo-pick:has(input:focus-visible) { outline:2px solid ${GOLD}; outline-offset:3px; }
  .rb-ord-photo-cta { flex:none; font-size:13px; font-weight:600; color:${INK}; background:${GOLD};
    padding:7px 13px; border-radius:3px; white-space:nowrap; }
  .rb-ord-photo-label { font-size:13.5px; color:${DIM}; line-height:1.4; }
  .rb-ord-photo-has { display:flex; align-items:center; gap:13px; padding:11px 13px;
    border:1px solid ${GOLD}; border-radius:4px; background:rgba(200,168,119,.07); }
  .rb-ord-photo-thumb { flex:none; width:46px; height:46px; object-fit:cover; border-radius:3px;
    border:1px solid rgba(238,211,170,.3); }
  .rb-ord-photo-meta { display:flex; flex-direction:column; gap:2px; min-width:0; }
  .rb-ord-photo-name { font-size:13.5px; color:${IVORY}; overflow:hidden; text-overflow:ellipsis;
    white-space:nowrap; }
  .rb-ord-photo-size { font-size:12px; color:${FAINT}; font-variant-numeric:tabular-nums; }
  .rb-ord-photo-clear { margin-left:auto; flex:none; background:none; border:0; cursor:pointer;
    font-family:${BODY}; font-size:12.5px; color:${DIM}; padding:10px 6px; text-decoration:underline;
    text-underline-offset:3px; }
  .rb-ord-photo-clear:hover { color:${IVORY}; }
  .rb-ord-photo-clear:focus-visible { outline:2px solid ${GOLD}; outline-offset:2px; border-radius:3px; }
  @media (max-width:520px) {
    /* The button and its sentence stop fitting side by side well before this. */
    .rb-ord-photo-pick { flex-direction:column; align-items:flex-start; gap:9px; }
  }

  /* "What is in it", inside the slip. The form is where a cake is chosen and
     the slip is where it is described, so the layers live here rather than
     floating between two questions. No border of its own: it is already inside
     the slip's frame, and a box inside a box is one line too many. */
  .rb-ord-spec { margin-top:12px; padding-top:12px; border-top:1px solid ${HAIR_SOFT}; }
  .rb-ord-spec-title { font-size:10.5px; font-weight:700; letter-spacing:.16em; text-transform:uppercase;
    color:${FAINT}; }
  .rb-ord-spec-list { list-style:none; margin:8px 0 0; padding:0; }
  .rb-ord-spec-row { display:flex; align-items:center; gap:9px; padding:4px 0;
    font-size:13px; color:${DIM}; animation:rb-ord-layerin .34s ${EASE} both; }
  .rb-ord-spec-dot { flex:none; width:4px; height:4px; border-radius:50%; background:${HAIR};
    transition:background .3s ${EASE}; }
  .rb-ord-spec-row[data-changed="true"] { color:${IVORY}; }
  .rb-ord-spec-row[data-changed="true"] .rb-ord-spec-dot { background:${GOLD}; }
  @keyframes rb-ord-layerin { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:none; } }
  @media (prefers-reduced-motion: reduce) { .rb-ord-spec-row { animation:none; } }
  @media (prefers-reduced-motion: reduce) { .rb-ord-extra { animation:none; } }
  /* The row still appears and the note still speaks — only the movement and
     the decaying tint go. */
  @media (prefers-reduced-motion: reduce) {
    .rb-ord-row, .rb-ord-added span { animation:none; }
    .rb-ord-row[data-fresh]::after { animation:none; opacity:0; }
    .rb-ord-addbtn:active { transform:none; }
  }

  /* text + form fields */
  .rb-ord-field { display:block; margin-top:18px; }
  /* Same flex row as a legend, so the optional tag keeps its gap now that the
     tag itself no longer carries a margin, and wraps left instead of indented. */
  .rb-ord-label { display:flex; align-items:baseline; flex-wrap:wrap; gap:3px 9px;
    font-size:13px; letter-spacing:.02em; color:${GOLD_LIGHT}; margin-bottom:7px; }
  .rb-ord-input, .rb-ord-select, .rb-ord-textarea {
    width:100%; box-sizing:border-box; font-family:${BODY}; font-size:16px; color:${IVORY};
    background:rgba(11,10,9,.5); border:1px solid ${HAIR}; border-radius:4px; padding:13px 14px;
    transition:border-color .2s ${EASE}, background .2s ${EASE}; color-scheme:dark; }
  .rb-ord-textarea { min-height:92px; resize:vertical; line-height:1.55; }
  /* Every <select> on this form was rendering the OS's own control — native
     arrow, native chip, none of it this page's language, and glaringly so on
     a near-black ground beside hand-styled inputs and the segmented toggle.
     appearance:none strips it; the chevron is drawn here in the page's gold
     so all three selects (occasion, size, pickup time) match the rest of the
     form. padding-right keeps the longest option off the chevron. */
  .rb-ord-select {
    -webkit-appearance:none; appearance:none; padding-right:38px;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7' viewBox='0 0 11 7'%3E%3Cpath d='M1.25 1.25L5.5 5.5l4.25-4.25' fill='none' stroke='%23C8A877' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
    background-repeat:no-repeat; background-position:right 14px center; }
  .rb-ord-select::-ms-expand { display:none; }
  /* Date and time inputs size themselves from their own contents on iOS and
     ignore a percentage width, so the collection-date field grew past the
     right edge of the phone while every other field stopped at the margin.
     min-width:0 is the part that actually does it: without it the intrinsic
     width wins over width:100%. */
  .rb-ord-input[type="date"], .rb-ord-input[type="time"] {
    -webkit-appearance:none; appearance:none; min-width:0; max-width:100%; }
  .rb-ord-input[type="date"]::-webkit-date-and-time-value { text-align:left; margin:0; }
  .rb-ord-input[type="date"]::-webkit-calendar-picker-indicator { margin:0 0 0 auto; }
  /* Belt and braces: nothing inside the form may be wider than the form. */
  .rb-ord-formwrap input, .rb-ord-formwrap select, .rb-ord-formwrap textarea { max-width:100%; }
  .rb-ord-input::placeholder, .rb-ord-textarea::placeholder { color:${DIM}; opacity:1; }
  .rb-ord-input:hover, .rb-ord-select:hover, .rb-ord-textarea:hover { border-color:rgba(238,211,170,.3); }
  .rb-ord-input:focus-visible, .rb-ord-select:focus-visible, .rb-ord-textarea:focus-visible {
    outline:2px solid ${GOLD}; outline-offset:2px; border-color:${GOLD}; }
  .rb-ord-input[aria-invalid="true"], .rb-ord-select[aria-invalid="true"] { border-color:#D98A76; }
  .rb-ord-hint { font-size:12.5px; color:${DIM}; margin-top:6px; line-height:1.45; }
  .rb-ord-err { font-size:12.5px; color:#E8A594; margin-top:6px; line-height:1.45; }
  /* A settled, unchangeable value — shown instead of a pointless one-option
     dropdown when there is only one collection point. Reads as information,
     not as a control the visitor failed to notice they could change. */
  /* The label already carries its own bottom margin; another 13px on top of it
     floated the address away from the thing naming it. */
  .rb-ord-readout { font-family:${BODY}; font-size:16px; color:${IVORY}; padding:2px 0 0; line-height:1.4; }
  .rb-ord-two { display:grid; grid-template-columns:1fr 1fr; gap:14px; }

  /* the slip */
  .rb-ord-slip { position:sticky; top:24px; border:1px solid ${HAIR}; border-radius:6px; padding:22px 20px 20px;
    background:linear-gradient(170deg, rgba(243,234,211,.055), rgba(243,234,211,.015));
    box-shadow:0 26px 60px -30px rgba(0,0,0,.8); }
  .rb-ord-slip-title { font-family:${DISPLAY}; font-size:20px; color:${GOLD_LIGHT}; }
  .rb-ord-slip-rule { height:0; border-bottom:1px dashed rgba(238,211,170,.28); margin:14px 0 4px; }
  .rb-ord-slip-empty { font-size:13.5px; color:${DIM}; line-height:1.55; margin:12px 0 0; font-style:italic; }
  .rb-ord-slipline { display:flex; align-items:baseline; gap:4px; padding:9px 0; }
  .rb-ord-slipline-name { font-size:14px; color:${IVORY}; }
  .rb-ord-slipline-sub { font-size:12px; color:${FAINT}; display:block; margin-top:2px; }
  .rb-ord-slipline-dots { flex:1; align-self:center; height:0; border-bottom:1.5px dotted rgba(238,211,170,.28);
    margin:0 4px; transform:translateY(2px); }
  .rb-ord-slipline-price { font-size:13.5px; color:${GOLD}; white-space:nowrap; font-variant-numeric:tabular-nums; }
  .rb-ord-slipline-price[data-free="true"] { color:${FAINT}; font-size:12px; }
  .rb-ord-total { display:flex; align-items:baseline; gap:4px; margin-top:6px; padding-top:14px;
    border-top:1px solid rgba(238,211,170,.22); }
  .rb-ord-total-label { font-size:13px; letter-spacing:.06em; text-transform:uppercase; color:${GOLD_LIGHT}; }
  .rb-ord-total-value { margin-left:auto; font-family:${DISPLAY}; font-size:27px; color:${GOLD};
    font-variant-numeric:tabular-nums; }
  .rb-ord-slip-note { font-size:12px; color:${DIM}; margin:12px 0 0; line-height:1.5; }
  /* The cake under construction. A gold hairline down its left edge is the
     same device the free-text answers use for "this belongs to the thing above
     it", here meaning "this is live and not yet added". */
  .rb-ord-draft { display:grid; grid-template-columns:52px minmax(0,1fr); gap:12px; align-items:center;
    margin:14px 0 2px; padding:10px 0 10px 12px; border-left:2px solid rgba(200,168,119,.42); }
  .rb-ord-draft:not(:has(.rb-ord-row-pic)) { grid-template-columns:minmax(0,1fr); }
  .rb-ord-draft-body { min-width:0; display:flex; flex-wrap:wrap; align-items:baseline; gap:8px; }
  .rb-ord-draft-name { font-family:${DISPLAY}; font-size:17px; color:${IVORY}; line-height:1.15; }
  .rb-ord-draft-tag { font-size:10px; letter-spacing:.12em; text-transform:uppercase; color:${GOLD};
    border:1px solid rgba(200,168,119,.4); border-radius:2px; padding:2px 6px; }
  /* ── the basket row ──
     Measured off the carts this was built against (nings.is, adidas, Urban
     Outfitters, lululemon, Faire): thumbnail left, name and price sharing the
     top baseline, the chosen options as label/value pairs beneath, and the two
     controls as small text links at the bottom edge. The photograph is what
     makes a row scannable — it is how you check you ordered the right cake
     without reopening the configurator. */
  .rb-ord-row { display:grid; grid-template-columns:52px minmax(0,1fr); gap:12px;
    padding:14px 0; border-bottom:1px dashed rgba(238,211,170,.18); }
  .rb-ord-row-pic { width:52px; aspect-ratio:1/1; border-radius:3px; overflow:hidden;
    border:1px solid ${HAIR_SOFT}; background:${INK}; }
  .rb-ord-row-pic img { width:100%; height:100%; object-fit:cover; display:block; }
  .rb-ord-row:not(:has(.rb-ord-row-pic)) { grid-template-columns:minmax(0,1fr); }
  .rb-ord-row-body { min-width:0; }
  .rb-ord-row-top { display:flex; align-items:baseline; gap:10px; }
  .rb-ord-row-name { font-size:14.5px; color:${IVORY}; }
  .rb-ord-row-price { margin-left:auto; font-size:13.5px; color:${GOLD}; white-space:nowrap;
    font-variant-numeric:tabular-nums; }
  /* label above value, not a colon-joined sentence: the labels form a column
     the eye can skim down, which is the whole reason the references use a
     definition list here. */
  .rb-ord-row-specs { margin:7px 0 0; display:grid; gap:4px; }
  .rb-ord-row-specs dt { font-size:10.5px; letter-spacing:.1em; text-transform:uppercase;
    color:${FAINT}; }
  .rb-ord-row-specs dd { margin:1px 0 0; font-size:12.5px; color:${DIM}; line-height:1.45; }
  .rb-ord-row-flag { margin:7px 0 0; font-size:11.5px; color:${GOLD_LIGHT}; }
  .rb-ord-row-acts { display:flex; align-items:center; gap:9px; margin-top:9px; }
  .rb-ord-row-acts > span { font-size:11px; color:${FAINT}; }
  .rb-ord-row-acts button { background:none; border:0; padding:2px 0; cursor:pointer; font-size:12px;
    color:${FAINT}; text-decoration:underline; text-underline-offset:3px; }
  .rb-ord-row-acts button:hover { color:${GOLD_LIGHT}; }
  .rb-ord-row-acts button:focus-visible { outline:2px solid ${GOLD}; outline-offset:2px; border-radius:2px; }
  /* …except the stepper, which is a control, not a link. */
  .rb-ord-row-acts .rb-ord-qty button { text-decoration:none; }
  /* The way back to the range, which every one of those carts keeps inside the
     basket ("Add items" in DoorDash's cart panel). Quiet: it is a second path,
     not the send. */
  .rb-ord-addmore { display:flex; align-items:center; gap:8px; width:100%; margin:12px 0 2px;
    padding:11px 12px; background:none; border:1px dashed rgba(238,211,170,.28); border-radius:4px;
    color:${GOLD_LIGHT}; font-size:13px; cursor:pointer;
    transition:border-color .2s ${EASE}, background .2s ${EASE}, color .2s ${EASE}; }
  .rb-ord-addmore span { font-size:15px; line-height:1; }
  .rb-ord-addmore:hover { border-color:${GOLD}; background:rgba(200,168,119,.07); color:${IVORY}; }
  .rb-ord-addmore:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; }
  .rb-ord-slip-title { display:flex; align-items:baseline; gap:10px; }
  .rb-ord-slip-count { margin-left:auto; font-family:${BODY}; font-size:11.5px; letter-spacing:.1em;
    text-transform:uppercase; color:${FAINT}; }
  /* The answer to "did that go in?", in words, next to the range rather than
     in a panel that sits below the fold on a phone. The line holds its height
     with a non-breaking space so nothing reflows when it speaks. */
  .rb-ord-added { margin:8px 0 0; min-height:17px; font-size:12.5px; color:${GOLD_LIGHT}; }
  .rb-ord-added span { display:inline-block; animation:rb-ord-addedin .24s ${EASE} both; }
  /* ── a shelf inside the range, not a step of its own ── */
  .rb-ord-shelf { margin-top:clamp(26px,3.8vh,38px); }
  .rb-ord-shelfhead { display:flex; align-items:center; gap:14px; }
  .rb-ord-shelfrule { flex:1; height:0; border-bottom:1px solid ${HAIR}; }
  .rb-ord-addcake { display:flex; align-items:center; gap:18px; margin-top:20px; flex-wrap:wrap; }
  /* Filled, and carrying the total — nings.is's own add-to-basket bar. An
     outlined button here read as a secondary link beside the options, which
     is exactly wrong: putting the cake in the basket is the moment. */
  .rb-ord-addbtn { display:inline-flex; align-items:baseline; gap:14px; padding:14px 22px;
    background:${GOLD}; border:1px solid ${GOLD}; border-radius:4px; color:${INK};
    font-family:${BODY}; font-weight:600; font-size:14.5px; cursor:pointer;
    transition:background .2s ${EASE}, border-color .2s ${EASE}, transform .2s ${EASE}; }
  .rb-ord-addbtn:hover { background:${GOLD_LIGHT}; border-color:${GOLD_LIGHT}; }
  /* Asymmetric: the press lands at once, the release settles back. */
  .rb-ord-addbtn:active { transform:scale(.985); transition-duration:.2s,.2s,.09s; }
  .rb-ord-addbtn:focus-visible { outline:2px solid ${GOLD_LIGHT}; outline-offset:3px; }
  .rb-ord-addbtn-sum { font-family:${DISPLAY}; font-size:16px; font-variant-numeric:tabular-nums;
    opacity:.82; }
  .rb-ord-linkbtn { background:none; border:0; padding:0; cursor:pointer; font-size:13px; color:${FAINT};
    text-decoration:underline; text-underline-offset:3px; }
  .rb-ord-linkbtn:hover { color:${GOLD_LIGHT}; }
  /* ── counter extras: compact rows, not photo cards ──
     They were 3:4 photo tiles, three across, and they ate about a screen of
     height for three items you add by the tray. Sindri's note, and he is
     right: this is the shelf you glance at on the way past, not the thing the
     page is about — the cakes are. nings.is's own menu and basket both use a
     small square thumbnail beside a name, a price and a control, which is
     also exactly the grammar the basket rows now use. So the same row shape
     appears in the shelf, in the basket and on the phone: one thumbnail, one
     line of name, one price, one stepper.

     The photographs are not wasted — they are the same files, just read at
     thumbnail size, and the product cards above still carry full pictures
     where the decision actually happens. */
  .rb-ord-extras { display:grid; gap:8px; margin-top:14px; max-width:560px;
    grid-template-columns:minmax(0,1fr); }
  /* NOTE ON THE NAME: .rb-ord-extra is already taken, by the free-text answer
     that opens under a choice ("Annar litur" and friends). Two different
     things under one class is how this row briefly turned every free-text box
     into a 48px grid, so the shelf row carries its own name. (And no
     backticks in here: this whole stylesheet is a template literal.) */
  .rb-ord-shelfitem { display:grid; grid-template-columns:48px minmax(0,1fr) auto; align-items:center;
    gap:12px; padding:8px 12px 8px 8px; border:1px solid ${HAIR}; border-radius:4px;
    background:${INK_DEEP}; transition:border-color .24s ${EASE}; }
  .rb-ord-shelfitem[data-on] { border-color:${GOLD}; }
  .rb-ord-shelfitem-pic { width:48px; height:48px; margin:0; border-radius:3px; overflow:hidden;
    background:${INK}; border:1px solid ${HAIR_SOFT}; }
  .rb-ord-shelfitem-pic img { width:100%; height:100%; object-fit:cover; display:block;
    filter:saturate(.96) brightness(.94); }
  .rb-ord-shelfitem-body { min-width:0; display:flex; flex-direction:column; gap:1px; }
  .rb-ord-shelfitem-name { font-family:${DISPLAY}; font-size:15.5px; color:${IVORY}; line-height:1.2;
    overflow-wrap:anywhere; }
  .rb-ord-shelfitem-price { font-size:12px; color:${FAINT}; font-variant-numeric:tabular-nums; }
  .rb-ord-shelfitem-price s { opacity:.55; margin-right:4px; }
  .rb-ord-shelfitem-price em { font-style:normal; color:${GOLD}; margin-left:6px; font-size:10.5px;
    text-transform:uppercase; letter-spacing:.08em; }
  /* The quantity break is a second line under the price, and it disappears
     once it applies rather than holding empty height in a row this short. */
  .rb-ord-shelfitem-bulk { font-size:11px; color:${GOLD}; font-variant-numeric:tabular-nums; }
  .rb-ord-shelfitem-bulk:empty { display:none; }
  /* ── one question per row ──
     Measured off Starbucks and Blank Street (every option section is a single
     row with a chevron, opening in place) and Uber Eats (a Required badge on
     the sections that block the order). The row carries its own answer on the
     right, so a closed question still tells you what it holds — which is what
     makes collapsing safe rather than hiding. */
  .rb-ord-acclist { margin-top:22px; border-top:1px solid ${HAIR}; }
  .rb-ord-acc { border-bottom:1px solid ${HAIR}; }
  .rb-ord-acc-head { display:flex; align-items:center; gap:12px; width:100%; padding:15px 2px;
    background:none; border:0; cursor:pointer; text-align:left; color:${IVORY};
    font-family:${BODY}; font-size:15px; transition:color .2s ${EASE}; }
  .rb-ord-acc-head:hover { color:${GOLD_LIGHT}; }
  .rb-ord-acc-head:focus-visible { outline:2px solid ${GOLD}; outline-offset:-2px; border-radius:3px; }
  .rb-ord-acc-q { display:flex; align-items:center; gap:9px; min-width:0; }
  .rb-ord-acc-req { font-size:9.5px; letter-spacing:.1em; text-transform:uppercase; color:${GOLD};
    border:1px solid rgba(200,168,119,.42); border-radius:2px; padding:2px 5px; white-space:nowrap; }
  .rb-ord-acc-a { margin-left:auto; font-size:13.5px; color:${GOLD_LIGHT}; text-align:right;
    overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:45%; }
  .rb-ord-acc-a[data-empty] { color:${FAINT}; }
  /* A chevron drawn from two borders: one element, no icon file, and it turns
     rather than swapping glyphs. */
  .rb-ord-acc-chev { flex:none; width:7px; height:7px; margin-left:2px;
    border-right:1.4px solid ${FAINT}; border-bottom:1.4px solid ${FAINT};
    transform:rotate(45deg) translateY(-2px); transition:transform .22s ${EASE}; }
  .rb-ord-acc[data-open] .rb-ord-acc-chev { transform:rotate(225deg) translateY(-2px); }
  .rb-ord-acc[data-err] { border-color:rgba(232,165,148,.5); }
  .rb-ord-acc[data-err] .rb-ord-acc-a { color:#E8A594; }
  .rb-ord-acc-body { padding:0 2px 6px; animation:rb-ord-accin .22s ${EASE} both; }
  @keyframes rb-ord-accin { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }
  @media (prefers-reduced-motion: reduce) {
    .rb-ord-acc-body { animation:none; }
    .rb-ord-acc-chev { transition:none; }
  }
  /* Inside a row the question is already asked by the row, so the fieldset
     drops its own top margin and its legend. */
  .rb-ord-group[data-bare] { margin-top:4px; }
  /* ── the optional questions, folded behind one line ── */
  .rb-ord-moreopts { display:inline-flex; align-items:center; gap:8px; margin-top:22px;
    padding:11px 16px; background:none; border:1px dashed rgba(238,211,170,.3); border-radius:4px;
    color:${GOLD_LIGHT}; font-size:13.5px; cursor:pointer;
    transition:border-color .2s ${EASE}, background .2s ${EASE}, color .2s ${EASE}; }
  .rb-ord-moreopts span { font-size:15px; line-height:1; }
  .rb-ord-moreopts:hover { border-color:${GOLD}; background:rgba(200,168,119,.07); color:${IVORY}; }
  .rb-ord-moreopts:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; }
  .rb-ord-qty[data-small] { margin-top:0; }
  .rb-ord-qty[data-small] button { width:44px; height:44px; }
  .rb-ord-qty[data-small] .rb-ord-qty-val { min-width:30px; font-size:16px; }
  .rb-ord-kjornudge { font-size:12.5px; color:${GOLD_LIGHT}; margin:12px 0 0; line-height:1.5;
    padding:9px 11px; border:1px dashed rgba(200,168,119,.35); border-radius:4px; }
  /* Quieter than the nudge: a standing fact, not a prompt. */
  .rb-ord-kjorinfo { font-size:12px; color:${FAINT}; margin:12px 0 0; line-height:1.5; }

  /* mobile running total, sticks under the page header, never at the bottom
     (a bottom-fixed bar would collide with the preview chrome) */
  .rb-ord-mobiletotal { display:none; }

  /* motion: each earns its place. line-in confirms a choice registered,
     total-bump signals the price changed, group-in covers the product swap. */
  @keyframes rb-ord-linein { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
  .rb-ord-slipline { animation:rb-ord-linein .26s ${EASE} both; }
  @keyframes rb-ord-bump { 0% { transform:none; } 38% { transform:scale(1.07); } 100% { transform:none; } }
  .rb-ord-total-value[data-bump="true"] { animation:rb-ord-bump .34s ${EASE}; }
  /* A quote is words, not a number, so it must not sit at display size where a
     price belongs. Shrinking it is what stops it reading as an amount. */
  .rb-ord-total-value[data-quote="true"], .rb-ord-mobiletotal-value[data-quote="true"] {
    font-family:${BODY}; font-size:14px; letter-spacing:.01em; color:${GOLD_LIGHT}; }
  @keyframes rb-ord-groupin { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  .rb-ord-groups[data-key] { animation:rb-ord-groupin .38s ${EASE} both; }
  /* A row does not fade in from nowhere: it arrives from the direction the
     basket grows, and the gold tint behind it decays once, so the eye is told
     WHICH row is new and then left alone. Two motions, one meaning. */
  @keyframes rb-ord-rowin { from { opacity:0; transform:translateY(7px); } to { opacity:1; transform:none; } }
  @keyframes rb-ord-rowfresh { from { opacity:1; } to { opacity:0; } }
  .rb-ord-row { position:relative; animation:rb-ord-rowin .24s ${EASE} both; }
  /* The tint decays as an overlay's OPACITY rather than as the row's own
     background: same look, composited, and it cannot repaint the row's text.
     Longer than the 300ms UI budget on purpose — this is not a transition
     between two states, it is a "this one is new" marker getting out of the
     way, and at 300ms it is over before the eye leaves the button. */
  .rb-ord-row[data-fresh]::after { content:''; position:absolute; inset:0 -8px; pointer-events:none;
    background:rgba(200,168,119,.13); border-radius:3px;
    animation:rb-ord-rowfresh 1.1s ${EASE} .16s both; }
  @keyframes rb-ord-addedin { from { opacity:0; transform:translateY(-3px); } to { opacity:1; transform:none; } }

  /* sent state */
  .rb-ord-done { border:1px solid ${GOLD}; border-radius:6px; padding:clamp(26px,4vw,40px);
    background:rgba(200,168,119,.07); text-align:center; animation:rb-ord-groupin .4s ${EASE} both; }
  .rb-ord-done-title { font-family:${DISPLAY}; font-size:clamp(26px,3.4vw,38px); margin:0; ${''} }
  /* The receipt stub. Two facts, equal weight, one hairline between them, so
     the screen has a shape instead of being five centred paragraphs. */
  .rb-ord-stub { display:flex; margin:22px auto 0; max-width:400px;
    border:1px solid rgba(238,211,170,.26); border-radius:4px; background:rgba(11,10,9,.28); }
  .rb-ord-stub-cell { flex:1 1 0; display:flex; flex-direction:column; gap:5px; align-items:center;
    padding:13px 12px; min-width:0; }
  .rb-ord-stub-cell + .rb-ord-stub-cell { border-left:1px solid rgba(238,211,170,.2); }
  .rb-ord-stub-key { font-size:10.5px; font-weight:700; letter-spacing:.14em; text-transform:uppercase;
    color:${FAINT}; }
  .rb-ord-stub-val { font-size:15px; color:${IVORY}; font-variant-numeric:tabular-nums;
    letter-spacing:.02em; white-space:nowrap; }
  .rb-ord-stub-val[data-price="true"] { font-family:${DISPLAY}; font-size:19px; color:${GOLD}; }
  .rb-ord-done-line { font-size:14px; color:${DIM}; margin:14px auto 0; max-width:44ch; line-height:1.6; }
  .rb-ord-done-line[data-good="true"] { color:${GOLD_LIGHT}; }
  /* The tel link carries tap padding, which reads as a gap in a sentence; pull
     it back so the line stays a line. */
  .rb-ord-done-line .rb-ord-tel { padding:6px 2px; }

  .rb-ord-sample { display:flex; gap:11px; align-items:flex-start; margin-top:20px; padding:12px 15px;
    border:1px dashed rgba(238,211,170,.3); border-radius:4px; background:rgba(243,234,211,.025); }
  .rb-ord-sample svg { flex:none; margin-top:1px; }
  .rb-ord-sample span { font-size:12.5px; color:${DIM}; line-height:1.5; }

  .rb-ord-submit { width:100%; margin-top:24px; font-family:${BODY}; font-weight:600; font-size:16px;
    padding:16px 28px; border-radius:4px; border:1px solid ${GOLD}; background:${GOLD}; color:${INK};
    cursor:pointer; transition:background .22s ${EASE}, border-color .22s ${EASE}, transform .16s ${EASE}; }
  .rb-ord-submit:hover:not(:disabled) { background:${GOLD_LIGHT}; border-color:${GOLD_LIGHT}; }
  .rb-ord-submit:active:not(:disabled) { transform:scale(.985); }
  .rb-ord-submit:disabled { opacity:.6; cursor:progress; }
  .rb-ord-submit:focus-visible { outline:2px solid ${GOLD_LIGHT}; outline-offset:3px; }
  .rb-ord-errsummary { margin-top:14px; font-size:13.5px; color:#E8A594; text-align:center; }

  /* The missing-items card. Not an alarm: a warm hairline card in the page's
     own ink, the list does the talking. Each row is a full-width button so the
     whole line is the target, and it slides in rather than blinking on. */
  .rb-ord-issues[data-empty] { display:none; }
  .rb-ord-issues { margin-top:16px; padding:14px 16px 8px; border:1px solid rgba(232,165,148,.32);
    border-left:0; border-right:0; background:linear-gradient(180deg, rgba(232,165,148,.06), rgba(232,165,148,0));
    animation:rb-ord-issuesin .28s ${EASE} both; }
  @keyframes rb-ord-issuesin { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:none; } }
  .rb-ord-issues-head { margin:0 0 6px; font-size:13px; letter-spacing:.02em; color:#E8A594; }
  .rb-ord-issues-list { list-style:none; margin:0; padding:0; }
  .rb-ord-issue { width:100%; min-height:44px; display:grid; grid-template-columns:1fr; gap:1px; text-align:left;
    padding:8px 0; background:none; border:0; border-top:1px solid rgba(238,211,170,.08); cursor:pointer;
    font-family:${BODY}; color:${IVORY}; }
  .rb-ord-issues-list li:first-child .rb-ord-issue { border-top:0; }
  .rb-ord-issue-what { font-size:14.5px; text-decoration:underline; text-decoration-color:rgba(238,211,170,.28);
    text-underline-offset:3px; transition:text-decoration-color .2s ${EASE}; }
  .rb-ord-issue-why { font-size:12.5px; color:${DIM}; }
  .rb-ord-issue:hover .rb-ord-issue-what, .rb-ord-issue:focus-visible .rb-ord-issue-what { text-decoration-color:${GOLD}; }
  .rb-ord-issue:focus-visible { outline:2px solid ${GOLD_LIGHT}; outline-offset:2px; }

  /* The review sheet. Centred card on desktop, a bottom sheet on phones —
     the thumb is already down there from pressing send. */
  .rb-ord-review-scrim { position:fixed; inset:0; z-index:400; background:rgba(8,7,6,.72);
    -webkit-backdrop-filter:blur(6px); backdrop-filter:blur(6px);
    display:flex; align-items:center; justify-content:center; padding:24px;
    animation:rb-ord-scrimin .22s ${EASE} both; }
  @keyframes rb-ord-scrimin { from { opacity:0; } to { opacity:1; } }
  .rb-ord-review { width:min(560px,100%); max-height:min(88vh,860px); overflow:auto; overscroll-behavior:contain;
    background:${INK_DEEP}; border:1px solid ${HAIR}; border-radius:4px; padding:28px 26px 22px;
    font-family:${BODY}; color:${IVORY}; outline:none;
    animation:rb-ord-reviewin .3s ${EASE} both; }
  @keyframes rb-ord-reviewin { from { opacity:0; transform:translateY(10px) scale(.985); } to { opacity:1; transform:none; } }
  .rb-ord-review-kicker { margin:0; font-size:11.5px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:${GOLD}; }
  .rb-ord-review-title { margin:10px 0 0; font-family:${DISPLAY}; font-weight:400; font-size:clamp(26px,4vw,34px); line-height:1.08; }
  .rb-ord-review-lede { margin:10px 0 0; font-size:14px; color:${DIM}; line-height:1.55; }
  .rb-ord-review-when { margin:20px 0 0; display:grid; grid-template-columns:1fr 1fr; gap:14px 18px;
    padding:14px 0; border-top:1px solid ${HAIR_SOFT}; border-bottom:1px solid ${HAIR_SOFT}; }
  .rb-ord-review-when dt { font-size:10.5px; letter-spacing:.12em; text-transform:uppercase; color:${FAINT}; }
  .rb-ord-review-when dd { margin:3px 0 0; font-size:14.5px; line-height:1.45; }
  .rb-ord-review-wide { grid-column:1 / -1; }
  .rb-ord-review-items { margin-top:6px; }
  .rb-ord-review-item { padding:12px 0; border-bottom:1px solid ${HAIR_SOFT}; }
  .rb-ord-review-top { display:flex; justify-content:space-between; gap:14px; align-items:baseline; }
  .rb-ord-review-name { font-family:${DISPLAY}; font-size:18px; color:${GOLD_LIGHT}; }
  .rb-ord-review-price { font-size:14.5px; font-weight:600; color:${GOLD}; white-space:nowrap; }
  .rb-ord-review-total { display:flex; justify-content:space-between; padding:14px 0 4px; font-size:15px; }
  .rb-ord-review-total span:last-child { font-family:${DISPLAY}; font-size:22px; color:${GOLD_LIGHT}; }
  .rb-ord-review-acts { display:grid; gap:4px; margin-top:8px; }
  .rb-ord-review-send { margin-top:14px; }
  .rb-ord-review-edit { min-height:44px; background:none; border:0; cursor:pointer; font-family:${BODY};
    font-size:14.5px; color:${DIM}; text-decoration:underline; text-underline-offset:3px;
    text-decoration-color:rgba(238,211,170,.28); }
  .rb-ord-review-edit:hover { color:${IVORY}; }
  .rb-ord-review-edit:focus-visible { outline:2px solid ${GOLD_LIGHT}; outline-offset:2px; }
  @media (max-width:560px) {
    .rb-ord-review-scrim { align-items:flex-end; padding:0; }
    .rb-ord-review { border-radius:10px 10px 0 0; border-bottom:0; max-height:92vh;
      padding:24px 18px calc(18px + env(safe-area-inset-bottom, 0px));
      animation-name:rb-ord-sheetin; }
    @keyframes rb-ord-sheetin { from { transform:translateY(24px); opacity:0; } to { transform:none; opacity:1; } }
    .rb-ord-review-when { grid-template-columns:1fr; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rb-ord-issues, .rb-ord-review, .rb-ord-review-scrim { animation-name:rb-ord-scrimin; }
  }
  /* padded so the phone number clears the 44px tap target on a phone */
  .rb-ord-tel { display:inline-block; padding:13px 10px; color:${GOLD_LIGHT}; text-decoration:none;
    border-bottom:1px solid rgba(238,211,170,.32); }
  .rb-ord-tel:hover { color:${IVORY}; border-bottom-color:${GOLD}; }
  .rb-ord-tel:focus-visible { outline:2px solid ${GOLD}; outline-offset:2px; border-radius:4px; }

  @media (max-width:900px) {
    .rb-ord-grid { grid-template-columns:1fr; gap:0; }
    /* the slip moves below the choices; a slim sticky bar carries the total instead */
    .rb-ord-slipwrap { order:2; margin-top:clamp(28px,4vh,40px); }
    .rb-ord-slip { position:static; }
    /* Breyta/Fjarlægja are 12px text links, which is right on a desktop cart
       and 22px tall on a phone — half a tap target. The text stays small; the
       button grows around it, and the row's own bottom padding comes off so
       the basket does not gain 22px per entry for nothing. */
    .rb-ord-row-acts { margin-top:2px; gap:16px; }
    .rb-ord-row-acts button { min-height:44px; display:inline-flex; align-items:center; }
    .rb-ord-row { padding-bottom:6px; }
    .rb-ord-formwrap { min-width:0;
    /* min-width:0 because this is a grid item, and a grid item's default
       min-width:auto lets any wide child (the extras card grid was the one
       that did it) stretch the whole form column past the phone's viewport
       instead of shrinking. The clipped result LOOKED fine in overflow checks
       because an ancestor hid the scroll — two of three cards were simply
       unreachable. */
    order:1; }
    .rb-ord-mobiletotal { display:flex; position:sticky; top:0; z-index:6; align-items:baseline; gap:10px;
      margin:0 calc(clamp(20px,4.5vw,72px) * -1); padding:11px clamp(20px,4.5vw,72px);
      background:rgba(11,10,9,.94); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
      border-bottom:1px solid ${HAIR}; }
    .rb-ord-mobiletotal-label { font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:${FAINT}; }
    .rb-ord-mobiletotal-value { margin-left:auto; font-family:${DISPLAY}; font-size:19px; color:${GOLD};
      font-variant-numeric:tabular-nums; }
    /* The bar's action. Small and gold: it is the same commitment as the
       button in the form, so it wears the same colour, and it sits where the
       thumb already is. */
    .rb-ord-mobileadd { flex:none; padding:9px 14px; border:1px solid ${GOLD}; border-radius:4px;
      background:${GOLD}; color:${INK}; font-family:${BODY}; font-weight:600; font-size:13px;
      cursor:pointer; transition:background .2s ${EASE}, transform .09s ${EASE}; }
    .rb-ord-mobileadd:active { transform:scale(.97); }
    .rb-ord-mobileadd:focus-visible { outline:2px solid ${GOLD_LIGHT}; outline-offset:2px; }
    .rb-ord-mobilemissing { flex:none; font-size:12px; color:${FAINT}; }
    /* Below the dock's usable width the picker becomes a list: a thumbnail
       beside the name says as much at a quarter of the height. */
    .rb-ord-prods { grid-template-columns:minmax(0,1fr); }
    .rb-ord-prod { display:grid; grid-template-columns:auto minmax(0,1fr);
      grid-template-areas:"pic name" "pic from"; align-content:center; row-gap:2px;
      aspect-ratio:auto; }
    .rb-ord-prod-pic { position:static; grid-area:pic; aspect-ratio:1 / 1;
      align-self:center; border-radius:3px; }
    /* No scrim on a 62px thumbnail — the text sits beside it, not on it. */
    .rb-ord-prod-pic::after { display:none; }
    .rb-ord-prod-name { position:static; grid-area:name; align-self:end; }
    .rb-ord-prod-from { position:static; grid-area:from; align-self:start; }
    /* The shelf is one column everywhere now, so a phone only needs the
       width. The 3:4 and 16:10 card rules went with the cards. */
    .rb-ord-extras { max-width:none; }
    /* On a phone the picker becomes a LIST, not three posters.
       Full-width cards with a letterbox photo came to 849px for three
       products: more than a whole screen of pictures before the customer
       reaches the first question. A thumbnail beside the name says exactly as
       much at a quarter of the height, and choosing between three things you
       can see at once is easier than scrolling past them one at a time.
       Grid areas rather than a wrapper element, so a product with no photo
       still lays out correctly: the column simply collapses. */
    .rb-ord-prod { column-gap:13px; padding:10px 12px; }
    .rb-ord-prod-pic { margin:0; width:62px; height:62px; }
    .rb-ord-prod-name { font-size:17px; padding-right:30px; }
    .rb-ord-prod-mark { top:50%; margin-top:-9px; right:12px; }
    /* the sticky bar already draws a divider, so the step right under it must
       not draw a second one. Adjacent-sibling, not :first-of-type, because the
       bar is itself the first div sibling. */
    .rb-ord-mobiletotal + .rb-ord-step { border-top:0; padding-top:0; margin-top:clamp(24px,3.5vh,34px); }
    .rb-ord-who { grid-template-columns:1fr; }
  }
  @media (max-width:520px) {
    .rb-ord-two { grid-template-columns:1fr; gap:0; }
    /* Wrapping is right on a narrow screen, but the price then has to land
       under the LABEL, not under the radio it has nothing to do with. */
    .rb-ord-choice-price { margin-left:0; padding-left:25px; width:100%; }
    /* Two per row on a phone: three would put "18.600 kr." on two lines. */
    .rb-ord-choices[data-layout="grid"] { grid-template-columns:repeat(2, minmax(0, 1fr)); }
    .rb-ord-choices[data-layout="grid"] .rb-ord-choice-price { width:auto; padding-left:0; }
    .rb-ord-choice { flex-wrap:wrap; }
  }
  @media (prefers-reduced-motion: reduce) {
    .rb-ord-slipline, .rb-ord-groups[data-key], .rb-ord-done { animation:none; }
    .rb-ord-total-value[data-bump="true"] { animation:none; }
    .rb-ord-prod, .rb-ord-choice, .rb-ord-submit, .rb-ord-input, .rb-ord-select, .rb-ord-textarea,
    .rb-ord-mark, .rb-ord-mark svg { transition:none; }
    .rb-ord-prod:active, .rb-ord-choice:active, .rb-ord-submit:active { transform:none; }
  }
`


/** 2026-08-07 -> 7. ágúst (is) / 7 August (en). Built by hand, no ICU. */
const MONTHS: Record<Lang, string[]> = {
  is: ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
}
function prettyDate(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const month = MONTHS[lang][m - 1] ?? ''
  return lang === 'is' ? `${d}. ${month}` : `${d} ${month}`
}

const WEEKDAYS: Record<Lang, string[]> = {
  is: ['sunnudagur', 'mánudagur', 'þriðjudagur', 'miðvikudagur', 'fimmtudagur', 'föstudagur', 'laugardagur'],
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
}
/** The date as a baker reads it: with the weekday spelled out.
 *
 *  "2026-08-21" tells Þorleifur nothing without a calendar; "fimmtudagur 21.
 *  ágúst" tells him which shift it lands on. Built from UTC parts rather than
 *  local-time parsing — `new Date('2026-08-21')` is parsed as UTC midnight, so
 *  reading it back with local getters can roll the day backwards west of
 *  Greenwich and name the wrong weekday. */
function prettyDateFull(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const wd = WEEKDAYS[lang][new Date(Date.UTC(y, m - 1, d)).getUTCDay()] ?? ''
  return `${wd} ${prettyDate(iso, lang)}`
}

const Check = () => (
  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
    <path d="M1 3.4L3.3 5.7L8 1" stroke="#131313" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface SlipLine {
  key: string
  name: string
  sub?: string
  /** A real number, or null for something that costs nothing. */
  price: number | null
  /** Nothing has been chosen yet, so there is no price to show. Distinct from
   *  a price of null: "included" is an answer, and a size nobody has picked is
   *  not free, it is unanswered. */
  pending?: boolean
}

export default function OrderSection(props: Parameters<typeof OrderForm>[0]) {
  const { ORDER_PRODUCTS, PICKUP_LOCATIONS, ordersPaused, ordersPauseMessage, LINKS } = useSiteContent()
  if (ordersPaused || !ORDER_PRODUCTS.length || !PICKUP_LOCATIONS.length) return <section style={{padding: '80px 24px', color: IVORY, background: INK}}>
    <h1>{props.lang === 'is' ? 'Sérpantanir' : 'Custom orders'}</h1>
    <p>{ordersPaused ? ordersPauseMessage[props.lang] : props.lang === 'is' ? 'Sérpantanir eru ekki í boði á vefnum í bili. Hafðu samband við okkur.' : 'Online custom orders are currently unavailable. Please contact the bakery.'}</p>
    <a href={`tel:${LINKS.phone}`}>{LINKS.phoneLabel}</a>
  </section>
  return <OrderForm {...props} />
}

function OrderForm({
  lang,
  /** On its own route the section carries the page's h1 and needs no top rule. */
  standalone = false,
  /** Lets the homepage teaser deep-link straight into a product. */
  initialProductId,
  initialOccasionId,
}: {
  lang: Lang
  standalone?: boolean
  initialProductId?: string
  initialOccasionId?: string
}) {
  const t = useOrderText(lang)
  const { LINKS, ORDER_PRODUCTS, OCCASIONS, PICKUP_LOCATIONS, hoursRows, HOURS_BY_DAY, dateExceptions, ORDER_EXTRAS, VEISLUKJOR } = useSiteContent()

  const [productId, setProductId] = useState(
    () => ORDER_PRODUCTS[0].id,
  )
  const product: OrderProduct = useMemo(
    () => ORDER_PRODUCTS.find((p) => p.id === productId) ?? ORDER_PRODUCTS[0],
    [productId, ORDER_PRODUCTS],
  )

  /** A private order and a company order need different fields, not a different
   *  form. The lane itself is switched off for now (COMPANY_ORDERS_ENABLED,
   *  owner's call 2026-09-18) — the state, the fields and the validation all
   *  stay; `who` simply cannot leave 'person' while the flag is false, so
   *  every `who === 'company'` branch below goes quiet at once instead of
   *  being deleted one by one. */
  const [whoPicked, setWhoPicked] = useState<'person' | 'company'>('person')
  const companyLane = COMPANY_ORDERS_ENABLED
  const who: 'person' | 'company' = companyLane ? whoPicked : 'person'
  const setWho = setWhoPicked

  /**
   * The order is a LIST of cakes now, not one. A ferming needs a
   * marsipanterta AND a kransakaka, and making that two separate orders meant
   * two forms, two references, two phone calls — and no way to price the
   * event as one thing, which is what veislukjör needs.
   *
   * The configurator below always edits ONE cake, the draft. "Bæta annarri
   * köku við" snapshots the draft into this list and clears the configurator;
   * the snapshot keeps the lines and totals AS SHOWN when it was added, the
   * same rule the order email follows, so nothing recomputes behind the
   * customer's back. `draftActive` is false between committing one cake and
   * choosing the next — the product radio deselects, and the draft's own
   * validation goes quiet until a product wakes it again.
   */
  interface CakeInOrder {
    key: string
    product: OrderProduct
    picked: Record<string, string[]>
    extrasText: Record<string, string>
    inscription: string
    qty: number
    lines: SlipLine[]
    total: number
    quote: boolean
    wantsPhoto: boolean
    photo: File | null
    size: OrderChoice | null
  }
  const [cakes, setCakes] = useState<CakeInOrder[]>([])
  const [draftActive, setDraftActive] = useState(true)
  /** Counter extras on the order — kleinur ×20 etc. Quantities only; prices
   *  live on ORDER_EXTRAS and switch with veislukjör. */
  const [extrasQty, setExtrasQty] = useState<Record<string, number>>({})
  const [qty, setQty] = useState(1)
  const [picked, setPicked] = useState<Record<string, string[]>>({})
  const [inscription, setInscription] = useState('')
  /** Free text belonging to a CHOICE, keyed `group_choice`. "Another colour"
   *  and "photo on the cake" are worthless without it: the order would arrive
   *  saying only "another colour" and cost exactly the phone call this form
   *  exists to remove. Kept in its own map rather than inside `picked` so that
   *  deselecting and reselecting a choice does not silently lose the typing. */
  const [extras, setExtras] = useState<Record<string, string>>({})
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    /** Pickup/delivery time. Collected because without it every single order
     *  costs Þorleifur a reply asking what time — the most common avoidable
     *  round trip in the whole flow. Constrained to opening hours below, so a
     *  customer cannot ask for 18:30 and force a second exchange either. */
    time: '',
    location: PICKUP_LOCATIONS[0].id,
    notes: '',
    // company only
    company: '',
    kennitala: '',
    contact: '',
    invoiceEmail: '',
    /* Preselected when the visitor arrived from the homepage lettering band
       having already picked an occasion. Validated against the list so a
       hand-typed ?tilefni= cannot put an unknown value on the order. */
    occasion: '',
    occasionOther: '',
    guests: '',
    handover: 'pickup' as 'pickup' | 'delivery',
    address: '',
  })
  // Static HTML has no search parameters. Apply deep links after hydration.
  useEffect(() => {
    if (initialProductId && ORDER_PRODUCTS.some(p => p.id === initialProductId)) setProductId(initialProductId)
    if (initialOccasionId && OCCASIONS.some(o => o.id === initialOccasionId)) setCustomer(c => ({...c, occasion: initialOccasionId}))
  }, [initialProductId, initialOccasionId])
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [triedSubmit, setTriedSubmit] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  /** True when the relay refused or the network failed — the customer must be
   *  told, and given the phone number, rather than left thinking it sent. */
  const [sendError, setSendError] = useState(false)
  /** Reference for THIS order, generated at submit time (never during render,
   *  which would differ between the prerendered HTML and the hydrated page).
   *  It exists so a photo sent afterwards can be tied to the right order. */
  const [orderRef, setOrderRef] = useState('')
  /** Whether the photo actually travelled, as reported by the send, not
   *  assumed from the fact that one was chosen. */
  const [photoDelivered, setPhotoDelivered] = useState(false)
  /** The address a receipt went to, or '' when none was sent. */
  const [receiptSent, setReceiptSent] = useState('')
  /**
   * The picture the customer wants on the cake, or the one they want us to work
   * from. It travels WITH the order as a mail attachment rather than being
   * uploaded anywhere: the site is static and has no storage, but the relay
   * accepts multipart, so the photo lands in the bakery's inbox attached to the
   * order it belongs to. Deliberately optional. Someone whose photo is on
   * another phone must still be able to place the order, and the order
   * reference covers sending it afterwards.
   */
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [photoErr, setPhotoErr] = useState('')

  const [now, setNow] = useState(0)
  useEffect(() => { setNow(Date.now()); const timer = window.setInterval(() => setNow(Date.now()), 30_000); return () => window.clearInterval(timer) }, [])
  const requiredNotice = [...cakes.map(c => c.product), ...(draftActive ? [product] : [])]
  const minimumPickup = noticeAt(requiredNotice, now)
  const earliest = now ? bakeryDate(minimumPickup) : ''
  const slots = pickupSlots(customer.date, HOURS_BY_DAY, dateExceptions, minimumPickup)

  /* Refs the product-switch effect reads without re-firing on their changes:
   * the committed cakes (a photo one of them attached must survive the switch)
   * and a cake being loaded back in for editing (whose restored choices the
   * effect must not wipe). */
  const restoreRef = useRef<CakeInOrder | null>(null)

  // Switching product invalidates every previous choice, so start that product clean.
  useEffect(() => {
    /* Unless the switch IS a restore: "Breyta" on a committed cake sets the
     * choices and then changes the product, and this effect used to fire
     * after both and wipe the restored size — the cake came back to the
     * configurator empty. Caught by clicking Breyta and reading the total. */
    if (restoreRef.current?.product.id === productId) {
      restoreRef.current = null
      return
    }
    setPicked({})
    setInscription('')
    setExtras({})
    // Committed cakes retain their own File; reset only this new draft.
    clearPhoto()
    setTouched((prev) => {
      const next: Record<string, boolean> = {}
      for (const k of Object.keys(prev)) if (k.startsWith('c_')) next[k] = prev[k]
      return next
    })
  }, [productId])

  // A date that was valid for a shorter lead time can become invalid on switch.
  useEffect(() => {
    setCustomer((c) => (c.date && c.date < earliest ? { ...c, date: '' } : c))
  }, [earliest])

  const MAX_PHOTO = 5 * 1024 * 1024 // the relay's attachment ceiling

  const choosePhoto = (file: File | null) => {
    setPhotoErr('')
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'].includes(file.type)) return setPhotoErr(t.errPhotoType)
    if (file.size + cakes.reduce((sum, cake) => sum + (cake.photo?.size ?? 0), 0) > MAX_PHOTO) return setPhotoErr(lang === 'is' ? 'Myndir allra kaka mega samtals vera mest 5 MB.' : 'Photos for all cakes must total no more than 5 MB.')
    setPhoto(file)
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return URL.createObjectURL(file)
    })
  }
  const clearPhoto = () => {
    setPhotoUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return ''
    })
    setPhoto(null)
    setPhotoErr('')
  }
  // Revoke on unmount too: without this every preview held its blob for the
  // life of the tab.
  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl) }, [photoUrl])

  const toggle = (group: OrderGroup, choiceId: string) => {
    setPicked((prev) => {
      const cur = prev[group.id] ?? []
      if (group.kind === 'single') return { ...prev, [group.id]: [choiceId] }
      if (cur.includes(choiceId)) return { ...prev, [group.id]: cur.filter((c) => c !== choiceId) }
      if (group.max && cur.length >= group.max) return prev
      return { ...prev, [group.id]: [...cur, choiceId] }
    })
    setTouched((prev) => ({ ...prev, [`g_${group.id}`]: true }))
    /* ANSWER, THEN MOVE ON. Publix's cake builder reveals the next question as
     * each one is answered rather than showing them all; with the questions in
     * rows, the equivalent is to close the one just answered and open the next
     * one that still blocks the order. Only for pick-one questions, and never
     * when the chosen option owns a field of its own — a free-text answer or a
     * photo upload lives INSIDE the row, and closing it would take the input
     * away mid-sentence. A pick-several question stays open because the
     * customer is probably not finished. */
    if (group.kind !== 'single' || group.id === product.sizeGroupId) return
    const chosen = group.choices.find((c) => c.id === choiceId)
    if (chosen?.freeText || chosen?.needsPhoto) return
    const next = accGroups.find(
      (g) => g.id !== group.id && g.required && (picked[g.id] ?? []).length === 0,
    )
    setOpenGroup(next ? next.id : null)
  }

  /** The size choice a per-person product is priced from, and whether anything
   *  picked has made this a quote rather than a price. */
  const size = useMemo(() => sizeChoiceOf(product, picked), [product, picked])

  /* The occasion, and whether it is even worth asking about.
   *
   * A product that names its own occasion has already answered the question,
   * so the step disappears rather than asking a customer to confirm what they
   * just chose. Otherwise the list is whichever half matches the person or
   * company they said they were. */
  const occasionList = useMemo(() => occasionsFor(OCCASIONS, who), [OCCASIONS, who])
  /* With a basket, the product only answers the occasion when EVERY cake in
   * the order names the same one. A barnaafmæliskaka alone needs no question;
   * add a kransakaka beside it and the question is open again. */
  const occasionIds = [...cakes.map((c) => c.product.occasionId), ...(draftActive ? [product.occasionId] : [])]
  const occasionAnswered =
    occasionIds.length > 0 && occasionIds[0] && occasionIds.every((id) => id === occasionIds[0])
      ? OCCASIONS.find((o) => o.id === occasionIds[0])
      : undefined
  const askOccasion = !occasionAnswered && occasionList.length > 0
  const occasion = occasionAnswered
    ?? occasionList.find((o) => o.id === customer.occasion)
  const quote = useMemo(() => isQuoteRequest(product, picked), [product, picked])
  const draftWantsPhoto = useMemo(() => needsPhoto(product, picked), [product, picked])
  // The order summary includes photo requirements from every cake.
  const wantsPhoto = cakes.some((c) => c.wantsPhoto) || (draftActive && draftWantsPhoto)
  /** The cake as configured, so the filling that swaps pears in for cocktail
   *  fruit shows the swap instead of hiding it in a footnote. */
  const layers = useMemo(() => compositionOf(product, picked), [product, picked])
  /**
   * Photos in the picker are all-or-nothing.
   *
   * One product with a photograph beside two without does not read as "two are
   * missing a picture", it reads as broken: the row stretches to the tall card
   * and the other two sit in empty boxes. So the picker shows photos only when
   * every product has one, and otherwise renders three equal cards that look
   * deliberate. Photographing the kransakaka brings the images back on their
   * own, here and in the CMS, with nothing to change.
   */
  const showPics = useMemo(() => ORDER_PRODUCTS.every((p) => !!p.image), [ORDER_PRODUCTS])

  const { lines, total } = useMemo(() => {
    const out: SlipLine[] = []
    const perPerson = product.pricePerPerson
    /* Sized products price themselves off the chosen size, whichever model
     * they use: a rate times a headcount, or a price stated per size. Either
     * way the size IS the price, so it leads the slip and there is no base
     * line to add it to. Only a product with no size group at all falls back
     * to a flat base price. */
    const sized = !!product.sizeGroupId
    let sum: number

    if (sized) {
      /* Before a size is picked the slip says so rather than showing 0 kr.,
       * which would read as free. */
      sum = size ? (choicePriceOf(product, size) ?? 0) : 0
      /* Only once a size exists. An unchosen size used to render as a row whose
       * dotted leader ran to an empty price, above a total that repeated the
       * same "choose a size" prompt: two placeholders saying one thing. The
       * slip's own empty state already covers this. */
      if (size) {
        out.push({
          key: 'size',
          name: size.label[lang],
          /* The rate explains a per-person price: "30 manna" over "930 kr. á
           * mann" is the arithmetic in two lines. A flat size price has no
           * arithmetic to show, and labelling it "Grunnverð" was actively
           * wrong — 6.950 kr. is what the 20-25 cake costs, not a base that
           * something gets added to. So it gets no sub-line at all. */
          sub: perPerson ? `${isk(perPerson)} ${t.perPerson}` : undefined,
          price: sum,
        })
      }
    } else {
      sum = product.basePrice
      out.push({ key: 'base', name: product.name[lang], sub: t.slipBase, price: product.basePrice })
    }

    for (const group of product.groups) {
      // The size group is already the line above; listing it twice reads as a charge.
      if (sized && group.id === product.sizeGroupId) continue
      for (const id of picked[group.id] ?? []) {
        const choice = group.choices.find((c) => c.id === id)
        if (!choice) continue
        sum += choice.priceDelta
        const typed = choice.freeText ? (extras[`${group.id}_${choice.id}`] ?? '').trim() : ''
        out.push({
          key: `${group.id}_${choice.id}`,
          name: typed ? `${choice.label[lang]}: ${typed}` : choice.label[lang],
          sub: group.label[lang],
          price: choice.priceDelta > 0 ? choice.priceDelta : null,
        })
      }
    }

    const written = inscription.trim()
    if (written && product.inscription) {
      out.push({ key: 'inscription', name: `“${written}”`, sub: product.inscription.label[lang], price: null })
    }
    // Quantity multiplies the whole configured item, so it is shown as its own
    // line rather than silently changing the numbers above it.
    if (qty > 1) {
      out.push({ key: 'qty', name: t.slipQty(qty), sub: `× ${isk(sum)}`, price: sum * qty })
    }
    return { lines: out, total: sum * qty }
  }, [product, picked, inscription, lang, qty, t, size, extras])

  /** Nothing to total yet. Showing "0 kr." here reads as a free cake, which is
   *  the one number this form must never put in front of a customer. */
  const unpriced = draftActive && !!product.sizeGroupId && !size

  /* ── The order's own arithmetic: cakes → veislukjör → extras. ──
   *
   * The draft counts while it is active and priced; committed cakes carry
   * their snapshotted totals. A quote anywhere makes the whole order a quote —
   * a percentage of a number that does not exist is not a discount, so the
   * kjör line disappears and a note says it lands on the confirmed price.
   *
   * The threshold reads CAKES ONLY. Extras never unlock the rate they are
   * discounted by, or forty cheap rúnstykki become a key to cheaper rúnstykki. */
  const draftCounts = draftActive && !quote && !unpriced && (size !== null || !product.sizeGroupId)
  const cakesSubtotal = cakes.reduce((s2, c) => s2 + (c.quote ? 0 : c.total), 0) + (draftCounts ? total : 0)
  const anyQuote = cakes.some((c) => c.quote) || (draftActive && quote)
  const kjor = !anyQuote && cakesSubtotal >= VEISLUKJOR.threshold
  const kjorDiscount = kjor ? Math.round((cakesSubtotal * VEISLUKJOR.discountPct) / 100) : 0
  const extrasSum = ORDER_EXTRAS.reduce((sum, ex) => sum + (extrasQty[ex.id] ?? 0) * extraUnitPrice(ex, extrasQty[ex.id] ?? 0, kjor), 0)
  /* How many things are in the basket, the way every cart states its own size
     ("1 hlutur · 1.490 kr." on nings.is, "Cart (1 item)" on Walmart).
     ENTRIES, not units, and that is a correction: counting units read
     "11 vörur" for one cake and ten kleinur, when ten kleinur is one thing the
     customer ordered. A clothing cart can count units because nobody buys
     units by the tray. The draft is deliberately not counted — it is not in
     the basket until the customer puts it there. */
  const basketCount = cakes.length
    + ORDER_EXTRAS.filter((ex) => (extrasQty[ex.id] ?? 0) > 0).length
  const orderTotal = cakesSubtotal - kjorDiscount + extrasSum

  /** What stands where the total goes when there is no number to put there. */
  const totalText = anyQuote
    ? t.quoteTotal
    : cakes.length === 0 && unpriced && extrasSum === 0
      ? t.slipPickSize
      : isk(orderTotal)
  const softTotal = anyQuote || (cakes.length === 0 && unpriced && extrasSum === 0)

  // Bump the total when it changes, so the price movement is felt, not just read.
  const [bump, setBump] = useState(false)
  const prevTotal = useRef(orderTotal)
  useEffect(() => {
    if (prevTotal.current === orderTotal) return
    prevTotal.current = orderTotal
    setBump(true)
    const id = window.setTimeout(() => setBump(false), 360)
    return () => window.clearTimeout(id)
  }, [orderTotal])

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    /* Draft-cake rules apply only while a draft is live. Between committing
     * one cake and choosing the next there is no half-configured cake to
     * complain about — but there must still BE a cake somewhere, or the
     * order is extras floating free of the thing they accompany. */
    if (!draftActive && cakes.length === 0) e.g_product = t.errNoCake
    if (draftActive) {
    if (product.sizeGroupId && !isQuoteRequest(product, picked) && !sizeChoiceOf(product, picked)) e[`g_${product.sizeGroupId}`] = t.errRequiredGroup
    for (const group of product.groups) {
      const selected = picked[group.id] ?? []
      const invalid = selected.some(id => !group.choices.some(choice => choice.id === id)) || new Set(selected).size !== selected.length || (group.kind === 'single' && selected.length > 1) || (group.max !== undefined && selected.length > group.max)
      if (invalid || (group.required && selected.length === 0)) {
        e[`g_${group.id}`] = group.kind === 'single' ? t.errRequiredGroup : t.errRequiredMulti
      }
    }
    /* A choice that opens a field has not really been answered until the field
     * is filled. Without this the form happily submits "Annar litur" with no
     * colour, which is the same phone call as having asked nothing at all. */
    for (const { group, choice } of freeTextChoices(product, picked)) {
      if (!(extras[`${group.id}_${choice.id}`] ?? '').trim()) {
        e[`x_${group.id}_${choice.id}`] = t.errFreeText
      }
    }
    }
    /* The occasion is optional. What it OPENS is not: having chosen "Annað",
       leaving the box empty submits an order whose occasion is the word
       "other", which is worse than not asking. Nothing here blocks a customer
       who simply skipped the step. */
    if (occasion?.freeText && !customer.occasionOther.trim()) {
      e.occasionOther = t.errOccasionOther
    }
    if (who === 'person') {
      if (!customer.name.trim()) e.c_name = t.errName
    } else {
      if (!customer.company.trim()) e.c_company = t.errCompany
      if (!customer.contact.trim()) e.c_contact = t.errContact
      const kt = customer.kennitala.replace(/[^\d]/g, '')
      if (!customer.kennitala.trim()) e.c_kennitala = t.errKennitala
      else if (kt.length !== 10) e.c_kennitala = t.errKennitalaFormat
      if (customer.handover === 'delivery' && !customer.address.trim()) e.c_address = t.errAddress
      if (customer.invoiceEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.invoiceEmail.trim())) {
        e.c_invoiceEmail = t.errEmail
      }
    }
    const digits = customer.phone.replace(/[^\d]/g, '')
    if (!customer.phone.trim()) e.c_phone = t.errPhone
    else if (digits.length < 7) e.c_phone = t.errPhoneFormat
    if (customer.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())) e.c_email = t.errEmail
    if (!customer.date) e.c_date = t.errDate
    else if (customer.date < earliest) e.c_date = t.errDateTooSoon(prettyDate(earliest, lang))
    if (!customer.time || !pickupSlots(customer.date, HOURS_BY_DAY, dateExceptions, noticeAt(requiredNotice, Date.now())).includes(customer.time)) e.c_time = lang === 'is' ? 'Veldu lausan afhendingartíma.' : 'Choose an available collection time.'
    if (!PICKUP_LOCATIONS.some(l => l.id === customer.location)) e.c_location = t.errRequiredGroup
    return e
  }, [product, picked, customer, earliest, lang, t, who, extras, draftActive, cakes, HOURS_BY_DAY, dateExceptions, now, PICKUP_LOCATIONS])

  const showErr = (key: string) => (touched[key] || triedSubmit ? errors[key] : undefined)

  /* ── WHAT IS MISSING, BY NAME ──
   * The old failure was one sentence under the button ("Það vantar enn nokkur
   * atriði") and a jump to the first field — which did nothing when that field
   * sat inside a collapsed question. Now every missing thing is listed by the
   * name the customer sees on the page, with the reason, and each one is a
   * button that opens its question and puts the cursor in it.
   * Ordered the way the page reads (cake, then when, then who), not the order
   * the validator happens to check things in. */
  const ISSUE_RANK = ['g_', 'x_', 'occasionOther', 'c_date', 'c_time', 'c_location', 'c_address',
    'c_company', 'c_kennitala', 'c_contact', 'c_name', 'c_phone', 'c_email', 'c_invoiceEmail']
  const FIELD_ID: Record<string, string> = {
    occasionOther: 'rb-ord-occasion-other', c_date: 'rb-ord-date', c_time: 'rb-ord-time',
    c_location: 'rb-ord-location', c_address: 'rb-ord-address', c_company: 'rb-ord-company',
    c_kennitala: 'rb-ord-kennitala', c_contact: 'rb-ord-contact', c_name: 'rb-ord-name',
    c_phone: 'rb-ord-phone', c_email: 'rb-ord-email', c_invoiceEmail: 'rb-ord-invoice-email',
  }
  const FIELD_LABEL: Record<string, string> = {
    occasionOther: t.occasionOtherLabel, c_date: t.fieldDate, c_time: t.fieldTime,
    c_location: t.fieldLocation, c_address: t.fieldAddress, c_company: t.fieldCompany,
    c_kennitala: t.fieldKennitala, c_contact: t.fieldContact, c_name: t.fieldName,
    c_phone: t.fieldPhone, c_email: t.fieldEmail, c_invoiceEmail: t.fieldInvoiceEmail,
  }
  const issues = useMemo(() => {
    const rank = (k: string) => {
      const i = ISSUE_RANK.findIndex((r) => (r.endsWith('_') ? k.startsWith(r) : k === r))
      return i < 0 ? ISSUE_RANK.length : i
    }
    const label = (k: string): string => {
      if (k === 'g_product') return t.issueCake
      if (k.startsWith('g_')) {
        const g = product.groups.find((x) => x.id === k.slice(2))
        return g ? `${product.name[lang]}: ${g.label[lang]}` : product.name[lang]
      }
      if (k.startsWith('x_')) {
        const hit = freeTextChoices(product, picked).find(({ group, choice }) => `x_${group.id}_${choice.id}` === k)
        return hit ? `${product.name[lang]}: ${hit.choice.label[lang]}` : product.name[lang]
      }
      return FIELD_LABEL[k] ?? k
    }
    return Object.keys(errors)
      .sort((a, b) => rank(a) - rank(b))
      .map((k) => ({ key: k, label: label(k), why: errors[k] }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors, product, picked, lang, t])

  /** Open the thing that is missing and put the cursor in it. A closed
   *  question has to be opened first, and its inputs only exist after that
   *  render — hence the frame before focusing. */
  const jumpTo = (key: string) => {
    const behavior: ScrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    const land = (el: HTMLElement | null | undefined) => {
      if (!el) return
      el.scrollIntoView({ block: 'center', behavior })
      el.focus({ preventScroll: true })
    }
    if (key === 'g_product') {
      backToRange()
      land(rangeRef.current?.querySelector<HTMLElement>('input[type="radio"]'))
      return
    }
    if (key.startsWith('g_')) {
      const id = key.slice(2)
      if (accGroups.some((g) => g.id === id)) setOpenGroup(id)
      requestAnimationFrame(() => requestAnimationFrame(() => {
        const root = formRef.current
        land(
          root?.querySelector<HTMLElement>(`[aria-describedby~="err_g_${id}"]`)
          ?? root?.querySelector<HTMLElement>(`#acc_${id} input, #acc_${id} select`)
          ?? root?.querySelector<HTMLElement>('[data-invalid="true"]'),
        )
      }))
      return
    }
    if (key.startsWith('x_')) {
      /* The text box only exists while its question is open, so open the
         question first. The group is found from the full key rather than by
         splitting it, because ids can themselves contain underscores. */
      const hit = freeTextChoices(product, picked).find(({ group, choice }) => `x_${group.id}_${choice.id}` === key)
      if (hit && accGroups.some((g) => g.id === hit.group.id)) setOpenGroup(hit.group.id)
      requestAnimationFrame(() => requestAnimationFrame(() => land(document.getElementById(`rb-ord-x-${key.slice(2)}`))))
      return
    }
    land(document.getElementById(FIELD_ID[key] ?? ''))
  }

  /* ── THE LAST LOOK ──
   * A valid send opens a review sheet instead of sending: when, what, who,
   * the total, and two buttons. Confirming re-submits the same form with the
   * flag set, so the send path below stays the single path it always was. */
  const [reviewing, setReviewing] = useState(false)
  const confirmedRef = useRef(false)
  const reviewRef = useModalFocus(reviewing)
  /* Close back to the send button. The shared hook restores whatever had focus
     when the sheet opened, but Safari does not focus a button on click, so
     that is often <body>. The frame lets the hook's restore run first. */
  /** A basket cake as label/value pairs, the way the review sheet and the
   *  customer's receipt both show it. */
  const specsOf = (c: CakeInOrder) => [
    ...c.lines
      .filter((l) => l.key !== 'qty' && l.key !== 'base')
      .map((l) => ({ key: l.key, label: (l.key === 'size' ? t.rowSize : l.sub) ?? '', value: l.name })),
    ...(c.qty > 1 ? [{ key: 'qty', label: t.fieldQty, value: String(c.qty) }] : []),
  ]
  const closeReview = () => {
    setReviewing(false)
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>('.rb-ord-submit')?.focus())
  }
  useEffect(() => {
    if (!reviewing) return
    /* The shared modal hook focuses the first control, which here is the SEND
       button — one stray Enter from the keyboard that just pressed send would
       send. Land on the sheet itself; Tab reaches the buttons. */
    reviewRef.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeReview() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [reviewing])

  /* ── The basket handlers. ──
   * Everything the email needs is snapshotted at commit time — lines, total,
   * quote — the same never-recompute rule the mail itself follows. */
  const draftErrorKeys = useMemo(
    () => Object.keys(errors).filter((k) => k.startsWith('g_') || k.startsWith('x_')),
    [errors],
  )
  const snapshotDraft = (): CakeInOrder => ({
    key: `${productId}-${Date.now()}`,
    product,
    picked,
    extrasText: extras,
    inscription,
    qty,
    lines,
    total,
    quote,
    wantsPhoto: draftWantsPhoto,
    photo: draftWantsPhoto ? photo : null,
    size,
  })
  /** The product grid, so adding an item can hand the range back. */
  const rangeRef = useRef<HTMLDivElement>(null)
  /** What just went into the basket. `n` only increments so that adding the
   *  same product twice still re-announces — a changing key, not new text. */
  const [justAdded, setJustAdded] = useState<{ key: string; name: string; n: number } | null>(null)
  const backToRange = () => {
    const reduce = typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    rangeRef.current?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
  }
  /** The basket's own add-more control: wake the configurator on the product
   *  already highlighted and take the customer up to the range. */
  /** The basket's add-more button, so focus has somewhere to land when the
   *  row holding the pressed button is removed. */
  const addMoreRef = useRef<HTMLButtonElement>(null)
  /** Emptying the basket removes the add-more button along with the last row,
   *  so the range's first product is the fallback landing place. */
  const focusAfterRemoval = () => {
    /* A ref can still point at a node React has just unmounted, and focusing
       a detached element silently lands on <body> — the exact failure this
       exists to prevent. So the node has to still be in the document. */
    const live = (el: HTMLElement | null) => (el && el.isConnected ? el : null)
    const target = live(addMoreRef.current)
      ?? live(rangeRef.current?.querySelector<HTMLElement>('input[type="radio"]') ?? null)
    target?.focus()
  }
  const addMore = () => {
    setDraftActive(true)
    backToRange()
  }
  const clearDraft = () => {
    clearPhoto()
    setPicked({})
    setInscription('')
    setExtras({})
    setQty(1)
  }
  const commitDraft = (): boolean => {
    if (draftErrorKeys.length > 0) {
      /* Same treatment as submit: mark and take the customer to the first
       * thing missing, rather than silently refusing the button. */
      setTouched((prev) => ({ ...prev, ...Object.fromEntries(draftErrorKeys.map((k) => [k, true])) }))
      /* With the questions collapsed, the first thing missing may be inside a
         closed row — and focusing a hidden input does nothing. Open it. */
      const firstBad = draftErrorKeys.find((k) => k.startsWith('g_'))?.slice(2)
      if (firstBad && accGroups.some((g) => g.id === firstBad)) setOpenGroup(firstBad)
      const first = formRef.current?.querySelector<HTMLElement>('[data-invalid="true"]')
      first?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      return false
    }
    const added = snapshotDraft()
    setCakes((prev) => [...prev, added])
    clearDraft()
    setDraftActive(false)
    /* Adding to a basket has to be ANSWERED, or the configurator just empties
       and the customer cannot tell whether it worked. Every reference answers
       it in the same two ways: the row appears in the basket, and the range
       comes back ready for the next choice (DoorDash returns to the menu with
       the cart popover; Faire and Urban Outfitters keep an explicit add-more
       control in the panel). The note is aria-live so it is not only visual. */
    setJustAdded({ key: added.key, name: added.product.name[lang], n: (justAdded?.n ?? 0) + 1 })
    backToRange()
    return true
  }
  const cancelDraft = () => {
    clearDraft()
    setDraftActive(false)
  }
  const removeCake = (key: string) => {
    setCakes((prev) => prev.filter((c) => c.key !== key))
    setJustAdded(null)
    /* The button that was just pressed no longer exists, so focus would fall
       to the document and a keyboard or screen-reader user would lose their
       place in the basket. Hand it to the way back into the range, which is
       the next thing they are likely to want — and when the row removed was
       the LAST one, that button is gone too, so the range itself takes it. */
    requestAnimationFrame(() => focusAfterRemoval())
  }
  const editCake = (key: string) => {
    const cake = cakes.find((c) => c.key === key)
    if (!cake) return
    /* A live, half-built draft must not be silently thrown away to make room.
     * If it commits, fine; if it cannot, the errors are now on screen and the
     * committed cake stays untouched. An inactive draft has nothing to lose. */
    if (draftActive && !commitDraft()) return
    setCakes((prev) => prev.filter((c) => c.key !== key))
    restoreRef.current = cake
    setProductId(cake.product.id)
    setPicked(cake.picked)
    setExtras(cake.extrasText)
    setInscription(cake.inscription)
    setQty(cake.qty)
    setPhoto(cake.photo)
    setPhotoUrl(previous => { if (previous) URL.revokeObjectURL(previous); return cake.photo ? URL.createObjectURL(cake.photo) : '' })
    setDraftActive(true)
  }
  const stepExtra = (id: string, dir: 1 | -1) => {
    const ex = ORDER_EXTRAS.find((e) => e.id === id)
    if (!ex) return
    setExtrasQty((prev) => {
      const next = Math.min(ex.max, Math.max(0, (prev[id] ?? 0) + dir * ex.step))
      return { ...prev, [id]: next }
    })
  }

  const formRef = useRef<HTMLFormElement>(null)
  const submitting = useRef(false)

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    if (submitting.current || status === 'done') return
    /* The review sheet's approval is good for ONE attempt. Consumed here,
       before any check can return early: otherwise a slot that expires while
       the sheet is open leaves the flag set, and the corrected order would
       then send without being reviewed again (found by the Codex audit). */
    const confirmed = confirmedRef.current
    confirmedRef.current = false
    setTriedSubmit(true)
    if (!pickupSlots(customer.date, HOURS_BY_DAY, dateExceptions, noticeAt(requiredNotice, Date.now())).includes(customer.time)) {
      setNow(Date.now())
      setTouched(previous => ({...previous, c_time: true}))
      formRef.current?.querySelector<HTMLElement>('#rb-ord-time')?.focus()
      return
    }
    if (Object.keys(errors).length > 0) {
      // Send focus to the first thing that needs fixing rather than leaving the
      // customer to hunt for it.
      const first = formRef.current?.querySelector<HTMLElement>('[data-invalid="true"]')
      first?.scrollIntoView({ block: 'center', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
      first?.focus({ preventScroll: true })
      return
    }
    if (!confirmed) {
      setReviewing(true)
      return
    }
    submitting.current = true
    setStatus('sending')
    setSendError(false)

    // Keep the same UUID across retries, without random values during SSR.
    const ref = orderRef || `RB-${crypto.randomUUID()}`
    setOrderRef(ref)

    const L = ORDER_T.is // the bakery reads its own orders in Icelandic
    const loc = PICKUP_LOCATIONS.find((l) => l.id === customer.location)?.label.is ?? customer.location
    /* "Annað: sextugsafmæli" beats "Annað". The typed answer rides WITH the
       label rather than as a separate row further down, so whoever reads the
       order sees the occasion and its detail as one thing. */
    const occTyped = customer.occasionOther.trim()
    const occ = occasion
      ? occasion.freeText && occTyped
        ? `${occasion.label.is}: ${occTyped}`
        : occasion.label.is
      : ''

    /* The order is SNAPSHOTTED here, not looked up when the email is read.
       Prices and names are written into the message as they were on screen at
       the moment of ordering, so a later price change in the CMS can never
       retroactively alter what a customer was quoted. See reynir-cms-plan.md. */
    /* The email Þorleifur actually reads.
     *
     * FormSubmit renders the keys of this object, in insertion order, as the
     * rows of the mail — so this object IS the email's layout, and the order
     * below is the whole design. It is arranged the way a baker triages a
     * docket, not the way the form happens to be laid out on screen:
     *
     *   1. WHEN and WHAT — the two facts that decide whether he can say yes.
     *   2. Collection or delivery, and where.
     *   3. The spec: every configured option, with its surcharge.
     *   4. The price snapshot.
     *   5. Who to call, together in one block.
     *   6. Their note, last, because it is the only free text.
     *
     * The old order buried the collection date tenth, below every cake option
     * and the invoicing email, which is exactly backwards: the date is the one
     * field that determines whether the order is even possible.
     *
     * Numeric prefixes keep FormSubmit from reordering keys and, more
     * usefully, give a human scanning on a phone something to hold onto.
     * Dates are spelled out with the weekday — an ISO string means nothing to
     * someone deciding which shift will bake it.
     */
    const delivering = who === 'company' && customer.handover === 'delivery'
    const when = `${prettyDateFull(customer.date, 'is')}, kl. ${customer.time}`

    /* Every cake in the order: the committed ones plus the draft on screen,
     * if one is live. Validation upstream guarantees a live draft is complete
     * and that an empty order cannot reach this line. */
    const allCakes: CakeInOrder[] = [...cakes, ...(draftActive ? [snapshotDraft()] : [])]
    const multi = allCakes.length > 1
    const cakeName = (c: CakeInOrder) =>
      `${c.product.name.is}${c.size ? ` (${c.size.label.is})` : ''}${c.qty > 1 ? ` — ${c.qty} stk.` : ''}`

    /* ⚠️ ONLY `_subject` LEAVES THIS OBJECT.
     *
     * These numbered keys are a leftover from the FormSubmit era, when the
     * relay rendered an object's keys as the rows of the email. The order now
     * goes to our own Worker, which reads `mail` below and ignores this
     * entirely — so a field added here and nowhere else is collected from the
     * customer and silently thrown away. That already happened twice, to the
     * invoicing address and the guest count. Add to `mail` (or to `mailRows`,
     * which becomes mail.options), never only to this. */
    const payload: Record<string, string> = {
      _subject: `${ref} · ${prettyDateFull(customer.date, 'is')} kl. ${customer.time} — ${anyQuote ? 'TILBOÐ ÓSKAST — ' : ''}${
        multi
          ? `${allCakes.length} kökur: ${allCakes.map((c) => c.product.name.is).join(' + ')}`
          : cakeName(allCakes[0])
      } — ${who === 'company' ? customer.company : customer.name}`,
      /* _template/_captcha/_honey are gone with the relay that read them. The
         underscore prefix still means "not a docket row": orderText skips
         these, so _subject can sit here beside the rows it summarises. */

      '1. Afhending': when,
      '2. Vara': multi ? allCakes.map(cakeName).join(' + ') : cakeName(allCakes[0]),
      '3. Sótt eða sent': delivering ? `Sent á ${customer.address}` : `Sótt í ${loc}`,
    }

    /* The same rows the slip showed, shaped for the docket. Built from the
     * SNAPSHOTS above rather than recomputed, so the mail can never disagree
     * with what the customer was quoted. */
    const mailRows: { label: string; value: string; note?: string; money?: boolean }[] = []

    let n = 4
    payload[`${n++}. Pöntunarnúmer`] = ref
    allCakes.forEach((cake, i) => {
      /* With more than one cake each gets a header row carrying its own
       * price, so the docket reads as sections, not one long spec. The
       * numeric prefixes keep every payload key unique even when two cakes
       * share a group label. */
      if (multi) {
        const head = `Kaka ${i + 1}: ${cakeName(cake)}`
        payload[`${n++}. ${head}`] = cake.quote ? 'Tilboð óskast' : isk(cake.total)
        mailRows.push({ label: `— ${head}`, value: cake.quote ? 'Tilboð óskast' : isk(cake.total), money: true })
      }
      cake.product.groups.forEach((g) => {
        const chosen = (cake.picked[g.id] ?? [])
          .map((cid) => {
            const c = g.choices.find((x) => x.id === cid)
            if (!c) return null
            // What they typed belongs ON the option, not in a separate row further
            // down: "Annar litur" and "lavender" are one answer, and splitting them
            // is how a baker ends up reading half of it.
            const typed = c.freeText ? (cake.extrasText[`${g.id}_${c.id}`] ?? '').trim() : ''
            const label = typed ? `${c.label.is}: ${typed}` : c.label.is
            if (c.quoteOnly) return `${label} (tilboð)`
            return c.priceDelta > 0 ? `${label} (+${isk(c.priceDelta)})` : label
          })
          .filter(Boolean)
        if (chosen.length) {
          payload[`${n++}. ${g.label.is}`] = chosen.join(', ')
          /* The size row carries the rate as its note, because "30 manna" beside
           * "930 kr. á mann" is the whole arithmetic of the price in one line. */
          const isSize = !!cake.product.pricePerPerson && g.id === cake.product.sizeGroupId
          mailRows.push({
            label: g.label.is,
            value: chosen.join(', '),
            note: isSize && cake.product.pricePerPerson ? `${isk(cake.product.pricePerPerson)} á mann` : undefined,
          })
        }
      })
      if (cake.product.inscription && cake.inscription.trim()) {
        payload[`${n++}. Áletrun`] = cake.inscription.trim()
        mailRows.push({ label: cake.product.inscription.label.is, value: cake.inscription.trim() })
      }
    })
    mailRows.push({ label: 'Pöntunarnúmer', value: ref })

    /* ── The order-level money block: cakes, kjör, extras, total. ── */
    if (multi && !anyQuote) {
      payload[`${n++}. Kökur samtals`] = isk(cakesSubtotal)
      mailRows.push({ label: 'Kökur samtals', value: isk(cakesSubtotal), money: true })
    }
    if (kjor) {
      /* The mail says out loud what the code knows: the percentage is a
       * placeholder. Þorleifur must see that on every order until he sets the
       * real number, because this line is a price HE is being committed to. */
      payload[`${n++}. Veislukjör`] =
        `−${isk(kjorDiscount)} (${VEISLUKJOR.discountPct}% af kökum — TIL VIÐMIÐUNAR, prósenta óstaðfest)`
      mailRows.push({
        label: 'Veislukjör',
        value: `−${isk(kjorDiscount)} (${VEISLUKJOR.discountPct}%)`,
        note: 'til viðmiðunar — prósentan er ekki staðfest',
        money: true,
      })
    }
    const chosenExtras = ORDER_EXTRAS.filter((ex) => (extrasQty[ex.id] ?? 0) > 0)
    for (const ex of chosenExtras) {
      const exQty = extrasQty[ex.id] ?? 0
      const exUnit = extraUnitPrice(ex, exQty, kjor)
      const cutNote = exUnit < ex.unitPrice ? (kjor ? ' (veisluverð)' : ' (magnverð)') : ''
      const line = `${exQty} stk. á ${isk(exUnit)}${cutNote} — ${isk(exQty * exUnit)}`
      payload[`${n++}. ${ex.label.is}`] = line
      mailRows.push({ label: ex.label.is, value: line, money: true })
    }
    /* Never send a number for a bespoke cake. An estimate in the inbox becomes
       the price the customer believes they were given. */
    /* The arithmetic in brackets only belongs to a single per-person cake
       standing alone. The moment kjör or extras join in, the total is no
       longer that multiplication and the brackets would be a lie. */
    const single = allCakes[0]
    const priceWorking =
      !multi && !kjor && chosenExtras.length === 0 &&
      single.size && single.product.pricePerPerson && typeof single.size.serves === 'number'
        ? ` (${single.size.serves} manns × ${isk(single.product.pricePerPerson)})`
        : ''
    payload[`${n++}. Áætlað verð`] = anyQuote
      ? 'Tilboð óskast, ekkert verð gefið upp á vefnum'
      : `${isk(orderTotal)}${priceWorking}`
    const attachmentName = (cake: CakeInOrder, index: number) => `kaka-${index + 1}-${(cake.photo?.name || 'mynd.jpg').replace(/[^\w.\- ]+/g, '_').slice(0, 60)}`
    allCakes.forEach((cake, index) => {
      if (!cake.wantsPhoto) return
      const note = cake.photo ? `Viðhengi: ${attachmentName(cake, index)}` : `Mynd verður send síðar með númerinu ${ref}, kaka ${index + 1}`
      mailRows.push({label: `Mynd — kaka ${index + 1}`, value: note})
    })
    /* NO total row here. The docket renders its own from `totalIsk`, so adding
     * one produced "SAMTALS 37.200 kr." twice in a row. Caught by rendering the
     * mail and looking at it, which is the only way that kind of duplication
     * ever shows up. A quote has no number, so it says so in its own row. */
    if (anyQuote) mailRows.push({ label: 'Verð', value: 'Tilboð óskast' })

    // Contact details in ONE block, so calling back does not mean hunting
    // through the mail. Phone first: a bakery rings, it does not email.
    payload[`${n++}. Sími`] = customer.phone
    payload[`${n++}. Nafn`] = who === 'company' ? customer.contact : customer.name
    if (customer.email.trim()) payload[`${n++}. Netfang`] = customer.email.trim()

    if (who === 'company') {
      payload[`${n++}. Fyrirtæki`] = customer.company
      payload[`${n++}. Kennitala`] = customer.kennitala
      if (customer.invoiceEmail.trim()) payload[`${n++}. Netfang fyrir reikning`] = customer.invoiceEmail.trim()
      if (customer.guests.trim()) payload[`${n++}. Fjöldi gesta`] = customer.guests.trim()
      /* ...and again as docket rows, because the numbered object above is NOT
       * what gets sent (see its declaration). These two were collected from
       * every company order and reached nobody: a firm typed its invoicing
       * address and its headcount into the form and Þorleifur never saw
       * either. They go through `options`, which the Worker already renders,
       * rather than as new top-level fields, so no Worker change is needed. */
      if (customer.invoiceEmail.trim()) {
        mailRows.push({ label: 'Netfang fyrir reikning', value: customer.invoiceEmail.trim() })
      }
      if (customer.guests.trim()) {
        mailRows.push({ label: 'Fjöldi gesta', value: customer.guests.trim() })
      }
    }
    /* Both kinds of customer now, and only when there is one — an absent
       occasion is a real answer to an optional question, not a blank row. */
    if (occ) payload[`${n++}. Tilefni`] = occ

    if (customer.notes.trim()) payload[`${n++}. Athugasemdir`] = customer.notes.trim()
    if (PLACEHOLDER_DATA) {
      payload[`${n++}. ATH`] = 'Vöruskrá vefsins er enn sýnishorn — verð og valmöguleikar eru ekki endanleg.'
    }
    payload[`${n++}. Beiðni send`] = new Date().toLocaleString('is-IS')

    try {
      /* ONE endpoint, ours, and an answer we can check.
       *
       * The order is sent as multipart so the photograph can ride with it as a
       * real attachment. The Worker replies with the id of a message the mail
       * provider ACCEPTED, and nothing below treats the order as sent without
       * one — which is the whole reason the old relay was replaced. It would
       * answer {"success":"true"} for a mail it delivered with no attachment,
       * and had already once answered success for a form that was not even
       * activated. A 200 meant "got your POST", never "did what you asked".
       *
       * Everything here fails CLOSED: any non-2xx, any missing id, any network
       * error drops into the catch below and shows the phone number. A bakery
       * order that silently vanishes is worse than one that never started. */
      const fd = new FormData()
      fd.append(
        'order',
        JSON.stringify({
          subject: payload._subject,
          replyTo: customer.email.trim() || customer.invoiceEmail.trim() || '',
          /* STRUCTURED, not a finished message. The sender renders the docket
           * from these fields, so the mail design lives with the sender rather
           * than being duplicated into this bundle, and every value is escaped
           * on the way in. The rows are already in triage order: the two facts
           * that decide whether the order is possible, then the spec, then the
           * total. */
          mail: {
            product: multi ? allCakes.map((c) => c.product.name.is).join(' + ') : allCakes[0].product.name.is,
            quantity: multi ? 1 : allCakes[0].qty,
            pickupWhen: when,
            pickupWhere: delivering ? `Sent á ${customer.address}` : loc,
            customerName: who === 'company' ? customer.contact : customer.name,
            customerPhone: customer.phone.trim(),
            customerEmail: customer.email.trim(),
            company: who === 'company' ? customer.company.trim() : '',
            kennitala: who === 'company' ? customer.kennitala.trim() : '',
            occasion: occ,
            message: customer.notes.trim(),
            totalIsk: anyQuote ? 0 : orderTotal,
            quote: anyQuote,
            provisional: PLACEHOLDER_DATA,
            options: mailRows,
          },
          /* The customer's RECEIPT, in the language they ordered in and built
           * from the same values the review sheet showed them, so the mail they
           * keep matches what they approved. The Worker only sends it once the
           * bakery's copy is accepted, and only from a verified bakery address;
           * without an email here there is simply no receipt. */
          receipt: {
            lang,
            ref,
            name: who === 'company' ? customer.contact.trim() : customer.name.trim(),
            when: `${prettyDateFull(customer.date, lang)}, ${lang === 'is' ? 'kl.' : 'at'} ${customer.time}`,
            where: delivering ? customer.address.trim() : (PICKUP_LOCATIONS.find((l) => l.id === customer.location)?.label[lang] ?? loc),
            items: [
              ...allCakes.map((c) => ({
                name: c.product.name[lang],
                price: c.quote ? null : c.total,
                specs: specsOf(c).map(({ label, value }) => ({ label, value })),
              })),
              ...ORDER_EXTRAS.filter((ex) => (extrasQty[ex.id] ?? 0) > 0).map((ex) => {
                const q = extrasQty[ex.id] ?? 0
                return { name: `${ex.label[lang]} × ${q}`, price: q * extraUnitPrice(ex, q, kjor), specs: [] }
              }),
            ],
            total: anyQuote ? null : orderTotal,
            notes: customer.notes.trim(),
          },
        }),
      )
      /* Only when a cake in the order still asks for it — a photo chosen for
       * an option later deselected must not ride along as a stray attachment
       * with no row explaining it. */
      allCakes.forEach((cake, index) => {
        if (cake.wantsPhoto && cake.photo) fd.append(`mynd-${index + 1}`, cake.photo, attachmentName(cake, index))
      })

      // No Content-Type header: the browser must set the multipart boundary
      // itself, and setting it by hand breaks the parse on the other side.
      const res = await fetch(ORDER_ENDPOINT, { method: 'POST', body: fd, signal: AbortSignal.timeout(45_000) })
      const body = (await res.json().catch(() => null)) as
        | { ok?: boolean; id?: string; attached?: boolean; reason?: string; receipt?: 'sent' | 'skipped' | 'failed' }
        | null
      if (!res.ok || !body?.ok || !body.id) {
        throw new Error(body?.reason ? String(body.reason) : `http-${res.status}`)
      }
      // The relay confirms attachment inclusion in the provider-accepted message.
      setPhotoDelivered(!!body.attached && allCakes.filter(c => c.wantsPhoto).every(c => !!c.photo))

      setReceiptSent(body.receipt === 'sent' ? customer.email.trim() : '')
      setStatus('done')
    } catch {
      // Never swallow this: a bakery order that silently vanishes is worse than
      // one that never started. Fall back to the phone number.
      setSendError(true)
      setStatus('idle')
    }
    submitting.current = false
    void L
  }

  const reset = () => {
    setCakes([])
    setExtrasQty({})
    setDraftActive(true)
    setPicked({})
    setInscription('')
    setExtras({})
    clearPhoto()
    setOrderRef('')
    setQty(1)
    setCustomer({
      name: '', phone: '', email: '', date: '', time: '', location: PICKUP_LOCATIONS[0].id, notes: '',
      company: '', kennitala: '', contact: '', invoiceEmail: '',
      occasion: '', occasionOther: '', guests: '', handover: 'pickup', address: '',
    })
    setTouched({})
    setTriedSubmit(false)
    setStatus('idle')
  }

  /* The photo picker, defined once because it now has two homes: inline
   * under the "mynd á tertu" choice while that cake is being configured, and
   * again in the details step when a committed cake wants a photo but the
   * configurator has moved on to another cake — without this second home,
   * committing a photo-cake HID the uploader while the order still needed
   * the picture. */
  const photoPicker = (
    <div className="rb-ord-photo">
    {photo ? (
      <div className="rb-ord-photo-has">
        <img className="rb-ord-photo-thumb" src={photoUrl} alt="" />
        <div className="rb-ord-photo-meta">
          <span className="rb-ord-photo-name">{photo.name}</span>
          {/* KB below a megabyte: a small
              photo reading "0.0 MB" looks
              like nothing attached. */}
          <span className="rb-ord-photo-size">
            {photo.size < 1024 * 1024
              ? `${Math.max(1, Math.round(photo.size / 1024))} KB`
              : `${(photo.size / 1024 / 1024).toFixed(1)} MB`}
          </span>
        </div>
        <button type="button" className="rb-ord-photo-clear" onClick={clearPhoto}>
          {t.photoRemove}
        </button>
      </div>
    ) : (
      <label className="rb-ord-photo-pick">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          onChange={(e) => choosePhoto(e.target.files?.[0] ?? null)}
        />
        <span className="rb-ord-photo-cta">{t.photoCta}</span>
        <span className="rb-ord-photo-label">{t.photoLabel}</span>
      </label>
    )}
    {photoErr
      ? <p className="rb-ord-err" role="alert">{photoErr}</p>
      : <p className="rb-ord-hint">{t.photoHint}</p>}
    </div>
  )

  /**
   * One group's markup, as a function rather than an inline map callback: the
   * required questions render immediately and the optional ones behind a
   * disclosure, and both need the same markup.
   */
  const renderGroup = (group: OrderGroup, opts?: { bare?: boolean }) => {
                    const cur = picked[group.id] ?? []
                    const atMax = !!group.max && cur.length >= group.max
                    const err = showErr(`g_${group.id}`)
                    const isSizeGroup = !!product.sizeGroupId && group.id === product.sizeGroupId
                    /* If nothing in the group changes the price, the price
                       column says "included" five times and communicates
                       nothing. Drop it entirely and the choices read as what
                       they are: a taste, not a tariff. It reappears the moment
                       the owner puts a surcharge on any one of them. */
                    const groupHasPrices =
                      isSizeGroup || group.choices.some((c) => c.priceDelta > 0 || c.quoteOnly)
                    return (
                      <fieldset className="rb-ord-group" key={group.id} data-bare={opts?.bare || undefined}>
                        {!opts?.bare && (
                        <legend className="rb-ord-legend">
                          <span className="rb-ord-legend-row">
                            <span className="rb-ord-legend-text">{group.label[lang]}</span>
                            <span className="rb-ord-tag">{group.required ? t.required : t.optional}</span>
                          </span>
                        </legend>
                        )}
                        {(group.help || group.max) && (
                          <p className="rb-ord-help">
                            {group.help ? group.help[lang] : t.chooseUpTo(group.max as number)}
                          </p>
                        )}
                        {group.layout === 'select' ? (
                          /* One row instead of eleven. The price is not hidden by
                             the dropdown, it is promoted out of it: chosen size
                             at display size on the right, rate underneath, and
                             every option still carries its own price when the
                             list is open. */
                          <div className="rb-ord-sizerow">
                            <select
                              className="rb-ord-select rb-ord-sizeselect"
                              value={cur[0] ?? ''}
                              data-invalid={err ? 'true' : undefined}
                              aria-invalid={!!err}
                              aria-label={group.label[lang]}
                              aria-describedby={err ? `err_g_${group.id}` : undefined}
                              onChange={(e) => toggle(group, e.target.value)}
                            >
                              <option value="" disabled style={{ background: INK }}>
                                {t.sizePrompt}
                              </option>
                              {group.choices.map((choice) => {
                                const sp = choicePriceOf(product, choice)
                                return (
                                  <option key={choice.id} value={choice.id} style={{ background: INK }}>
                                    {choice.label[lang]}
                                    {sp !== null ? `  ·  ${isk(sp)}` : ''}
                                  </option>
                                )
                              })}
                            </select>
                            {/* Only once there is a price. The rate on its own,
                                hanging under an empty dropdown, was a line of
                                text belonging to nothing. It lives in the help
                                line above until a size makes it a real price. */}
                            {isSizeGroup && size && (
                              <div className="rb-ord-sizeprice" aria-live="polite">
                                <span className="rb-ord-sizeprice-num" data-bump={bump}>
                                  {isk(choicePriceOf(product, size) ?? 0)}
                                </span>
                                {/* The rate underneath explains a per-person
                                    number. A flat size price is the whole
                                    story and gets no second line. */}
                                {product.pricePerPerson && (
                                  <span className="rb-ord-sizeprice-rate">
                                    {isk(product.pricePerPerson)} {t.perPerson}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                        <div className="rb-ord-choices" data-layout={group.layout ?? 'list'}>
                          {group.choices.map((choice) => {
                            const on = cur.includes(choice.id)
                            const off = !on && atMax
                            /* Size chips carry the REAL price of that size, not
                               a surcharge. That is the whole point of the
                               owner's model: the customer picks how many people
                               are coming and reads the finished price off the
                               same row. True of both pricing models — the rate
                               times the headcount, or the price he set for that
                               size — which is why it goes through one helper. */
                            const sizePrice = isSizeGroup ? choicePriceOf(product, choice) : null
                            const fx = choice.freeText
                            const fxKey = `${group.id}_${choice.id}`
                            const fxErr = showErr(`x_${fxKey}`)
                            return (
                              <div key={choice.id}>
                                <label className="rb-ord-choice" data-on={on} data-off={off}>
                                  <input
                                    type={group.kind === 'single' ? 'radio' : 'checkbox'}
                                    name={`rb-ord-${group.id}`}
                                    checked={on}
                                    disabled={off}
                                    data-invalid={err ? 'true' : undefined}
                                    aria-describedby={err ? `err_g_${group.id}` : undefined}
                                    onChange={() => toggle(group, choice.id)}
                                  />
                                  <span className="rb-ord-mark" data-shape={group.kind === 'single' ? 'round' : 'box'} aria-hidden="true">
                                    <Check />
                                  </span>
                                  <span className="rb-ord-choice-label">
                                    {choice.label[lang]}
                                    {choice.note && <span className="rb-ord-choice-note">{choice.note[lang]}</span>}
                                  </span>
                                  {groupHasPrices && (
                                    <span
                                      className="rb-ord-choice-price"
                                      data-free={sizePrice === null && choice.priceDelta === 0 && !choice.quoteOnly}
                                    >
                                      {sizePrice !== null
                                        ? isk(sizePrice)
                                        : choice.quoteOnly
                                          ? t.quoteTotal
                                          : choice.priceDelta === 0
                                            ? t.included
                                            : `+ ${isk(choice.priceDelta)}`}
                                    </span>
                                  )}
                                </label>
                                {/* The field belonging to this choice, revealed only
                                    when it is picked. Rendering it inside the row it
                                    belongs to is what keeps "another colour" from
                                    submitting as just "another colour". */}
                                {fx && on && (
                                  <div className="rb-ord-extra">
                                    <label className="rb-ord-label" htmlFor={`rb-ord-x-${fxKey}`}>
                                      {fx.label[lang]}
                                    </label>
                                    <input
                                      id={`rb-ord-x-${fxKey}`}
                                      className="rb-ord-input"
                                      type="text"
                                      maxLength={fx.maxLength}
                                      placeholder={fx.placeholder[lang]}
                                      value={extras[fxKey] ?? ''}
                                      data-invalid={fxErr ? 'true' : undefined}
                                      aria-invalid={!!fxErr}
                                      aria-describedby={fxErr ? `err_x_${fxKey}` : undefined}
                                      onChange={(e) => setExtras((x) => ({ ...x, [fxKey]: e.target.value }))}
                                      onBlur={() => setTouched((prev) => ({ ...prev, [`x_${fxKey}`]: true }))}
                                    />
                                    {fxErr && <p className="rb-ord-err" id={`err_x_${fxKey}`} role="alert">{fxErr}</p>}
                                    {/* The upload belongs to the choice that
                                        needs a picture, not to a general
                                        attachments box further down the form. */}
                                    {choice.needsPhoto && PHOTO_UPLOAD_ENABLED && photoPicker}
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                        )}
                        {err && <p className="rb-ord-err" id={`err_g_${group.id}`} role="alert">{err}</p>}
                      </fieldset>
                    )
  }

  /* ── ONE QUESTION OPEN AT A TIME ──
   *
   * The configurator used to lay every question out at full height: six for
   * the marsipanterta, about four screens before the customer reached the
   * button. Sindri's note — "it feels like people need to read a whole page
   * before they order a cake" — and the references agree on the shape:
   * Starbucks and Blank Street collapse every option section to a single row
   * with a chevron, Uber Eats badges the required ones, and Publix's cake
   * builder only reveals a question once the previous choice is made.
   *
   * So each question is a row carrying its own answer, and opens on tap. The
   * size keeps its own promoted-price row above them, because it is the one
   * question that IS the price, and because that control was chosen
   * deliberately after cards and tiles were both rejected.
   */
  const sizeGroup = useMemo(
    () => product.groups.find((g) => g.id === product.sizeGroupId) ?? null,
    [product],
  )
  const accGroups = useMemo(
    () => product.groups.filter((g) => g.id !== product.sizeGroupId),
    [product],
  )
  /** Which question is open. One at a time: two open panels reintroduce the
   *  wall this exists to remove. Cleared when the product changes, because the
   *  ids belong to that product's questions. */
  const [openGroup, setOpenGroup] = useState<string | null>(null)
  useEffect(() => { setOpenGroup(null) }, [productId])
  /** What a collapsed row shows on its right: the answer, in the customer's
   *  own words, so a closed question still states what it holds. */
  const groupAnswer = (group: OrderGroup): string =>
    (picked[group.id] ?? [])
      .map((id) => group.choices.find((c) => c.id === id)?.label[lang])
      .filter(Boolean)
      .join(', ')
  /** What still blocks adding this cake. The sticky bar counts these instead
   *  of offering a button that refuses — Skip's own bar says "2 selections
   *  required" in that state.
   *
   *  It counts the SAME keys the button checks (draftErrorKeys), not just
   *  unanswered groups: "Mynd á tertu" is an answered question that opens a
   *  required field of its own, and counting groups alone offered an Add
   *  button that would bounce with the row closed behind it. */
  const missingRequired = draftErrorKeys.length

  const slip = (
    <div className="rb-ord-slip">
      <div className="rb-ord-slip-title">
        <span>{t.slipTitle}</span>
        {/* Every cart states its own size in the title. Cakes and counter
            extras are both things in the basket, so both count. */}
        {basketCount > 0 && <span className="rb-ord-slip-count">{t.basketCount(basketCount)}</span>}
      </div>
      <div className="rb-ord-slip-rule" aria-hidden="true" />
      <div>
        {/* The empty state was written but never rendered: before anything was
            chosen the slip showed a placeholder row instead, complete with a
            dotted leader to nowhere. */}
        {cakes.length === 0 && !draftActive && <p className="rb-ord-slip-empty">{t.slipEmpty}</p>}
        {/* Cakes already in the order, exactly as priced when they were added.
            Each is one row — the full option spec lives in the email — plus
            the two small controls that keep the basket honest: change it, or
            take it out. */}
        {/* A basket row, built on the grammar every cart on Mobbin shares
            (adidas, Urban Outfitters, lululemon, Faire, Walmart, Selfridges):
            the photograph, the product name with its price on the same
            baseline, then the CHOICES as label/value pairs underneath, then
            Edit and Remove as small text links at the row's bottom edge — not
            buttons competing with the send. Skinned in this page's own
            language: ink ground, hairline rule, gold numerals, no white card.

            One line per row was not enough. "Marsipanterta · 40 manna" hid the
            filling, the writing and the strawberries, so the only way to check
            an order was to reopen the configurator. */}
        {cakes.map((c) => {
          const specs: { key: string; label: string; value: string }[] = []
          for (const line of c.lines) {
            if (line.key === 'qty' || line.key === 'base') continue
            specs.push({
              key: line.key,
              /* The size line's sub-line is the RATE ("930 kr. á mann"), not a
                 field name, and the group's own legend is a question, so the
                 size gets a short attribute label of its own. Every other line
                 already carries its group name. */
              label: (line.key === 'size' ? t.rowSize : line.sub) ?? '',
              value: line.name,
            })
          }
          if (c.qty > 1) specs.push({ key: 'qty', label: t.fieldQty, value: String(c.qty) })
          return (
            <div className="rb-ord-row" key={c.key} data-fresh={justAdded?.key === c.key || undefined}>
              {c.product.image && (
                <span className="rb-ord-row-pic" aria-hidden="true">
                  <img src={c.product.image} alt="" loading="lazy" decoding="async" width={1400} height={1400} />
                </span>
              )}
              <div className="rb-ord-row-body">
                <div className="rb-ord-row-top">
                  <span className="rb-ord-row-name">{c.product.name[lang]}</span>
                  <span className="rb-ord-row-price">{c.quote ? t.quoteTotal : isk(c.total)}</span>
                </div>
                {specs.length > 0 && (
                  <dl className="rb-ord-row-specs">
                    {specs.map((sp) => (
                      <div key={sp.key}>
                        {sp.label && <dt>{sp.label}</dt>}
                        <dd>{sp.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                {c.wantsPhoto && !c.photo && <p className="rb-ord-row-flag">{t.photoLabel}</p>}
                <div className="rb-ord-row-acts">
                  <button type="button" onClick={() => editCake(c.key)} aria-label={`${t.btnEditCake}: ${c.product.name[lang]}`}>{t.btnEditCake}</button>
                  <span aria-hidden="true">·</span>
                  <button type="button" onClick={() => removeCake(c.key)} aria-label={`${t.btnRemoveCake}: ${c.product.name[lang]}`}>{t.btnRemoveCake}</button>
                </div>
              </div>
            </div>
          )
        })}
        {/* THE CAKE BEING CHOSEN. Its lines were already live — size, every
            option, the writing, the quantity — but nothing said which cake
            they belonged to: a sized product has no base line, so the panel
            opened with "40 manna" and no name. With two marsipantertur and a
            kransakaka in one order that is unreadable. Same photograph and
            name as a basket row, marked as not yet added, and it appears as
            soon as a product is live rather than waiting for a price. */}
        {draftActive && (
          <div className="rb-ord-draft">
            {product.image && (
              <span className="rb-ord-row-pic" aria-hidden="true">
                <img src={product.image} alt="" loading="lazy" decoding="async" width={1400} height={1400} />
              </span>
            )}
            <div className="rb-ord-draft-body">
              <span className="rb-ord-draft-name">{product.name[lang]}</span>
              <span className="rb-ord-draft-tag">{t.draftTag}</span>
            </div>
          </div>
        )}
        {draftActive && lines.map((line) => (
          <div className="rb-ord-slipline" key={line.key}>
            <span className="rb-ord-slipline-name">
              {line.name}
              {line.sub && <span className="rb-ord-slipline-sub">{line.sub}</span>}
            </span>
            <span className="rb-ord-slipline-dots" aria-hidden="true" />
            <span className="rb-ord-slipline-price" data-free={line.price === null}>
              {line.pending ? '' : line.price === null ? t.included : isk(line.price)}
            </span>
          </div>
        ))}
      </div>
      {draftActive && layers.length > 0 && (
        <div className="rb-ord-spec">
          <div className="rb-ord-spec-title">{t.specTitle}</div>
          <ul className="rb-ord-spec-list">
            {layers.map((l) => (
              <li key={`${l.label.is}_${l.changed}`} className="rb-ord-spec-row" data-changed={l.changed}>
                <span className="rb-ord-spec-dot" aria-hidden="true" />
                {l.label[lang]}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* The order-level lines: the automatic party rate, then the counter
          extras. A quote suppresses the kjör line — a percentage of a number
          that does not exist is not a discount — and a note below says where
          it lands instead. */}
      {kjor && !anyQuote && (
        <div className="rb-ord-slipline">
          <span className="rb-ord-slipline-name">
            {t.kjorLine}
            <span className="rb-ord-slipline-sub">{t.kjorSub(VEISLUKJOR.discountPct)}</span>
          </span>
          <span className="rb-ord-slipline-dots" aria-hidden="true" />
          <span className="rb-ord-slipline-price">{isk(-kjorDiscount)}</span>
        </div>
      )}
      {/* An extra in the basket is a basket row too, not a dotted price line.
          It was the one entry that looked different from everything else in
          the panel, and nings.is's own basket shows every entry the same way:
          photograph, name, its own quantity control, price. Unlike a cake,
          this quantity is still live — extras are counter goods with no frozen
          configuration — so the stepper belongs on the row rather than a
          "Breyta" link that would have nothing to open. */}
      {ORDER_EXTRAS.filter((ex) => (extrasQty[ex.id] ?? 0) > 0).map((ex) => {
        const exQty = extrasQty[ex.id] ?? 0
        const exUnit = extraUnitPrice(ex, exQty, kjor)
        return (
          <div className="rb-ord-row" key={`extra_${ex.id}`}>
            {ex.image && (
              <span className="rb-ord-row-pic" aria-hidden="true">
                <img src={ex.image} alt="" loading="lazy" decoding="async" width={480} height={480} />
              </span>
            )}
            <div className="rb-ord-row-body">
              <div className="rb-ord-row-top">
                <span className="rb-ord-row-name">{ex.label[lang]}</span>
                <span className="rb-ord-row-price">{isk(exQty * exUnit)}</span>
              </div>
              <dl className="rb-ord-row-specs">
                <div>
                  <dt>{lang === 'is' ? 'Verð á stykki' : 'Unit price'}</dt>
                  <dd>
                    {isk(exUnit)}
                    {exUnit < ex.unitPrice && ` · ${kjor ? t.extrasKjorTag : t.extrasBulkTag}`}
                  </dd>
                </div>
              </dl>
              <div className="rb-ord-row-acts">
                <span className="rb-ord-qty" data-small="true" role="group" aria-label={ex.label[lang]}>
                  <button
                    type="button"
                    onClick={() => {
                      stepExtra(ex.id, -1)
                      /* Below one step this row disappears with the focus in it. */
                      if (exQty - ex.step <= 0) requestAnimationFrame(() => focusAfterRemoval())
                    }}
                    aria-label={`${lang === 'is' ? 'Fækka' : 'Remove'} ${ex.label[lang]}`}
                  >−</button>
                  <span className="rb-ord-qty-val" aria-live="polite">{exQty}</span>
                  <button type="button" onClick={() => stepExtra(ex.id, 1)} disabled={exQty >= ex.max} aria-label={`${lang === 'is' ? 'Bæta við' : 'Add'} ${ex.label[lang]}`}>+</button>
                </span>
              </div>
            </div>
          </div>
        )
      })}
      {/* Faire, Urban Outfitters and Walmart all keep an explicit way back to
          the range inside the basket; DoorDash's cart panel calls it "Add
          items". It sits under every entry — cakes AND extras — because a
          control that appeared in the middle of the basket read as if it
          added something to that half of it. While a cake is being configured
          the filled button in the range IS this path, so it stays hidden then
          rather than competing with it. */}
      {!draftActive && cakes.length > 0 && (
        <button type="button" className="rb-ord-addmore" onClick={addMore} ref={addMoreRef}>
          <span aria-hidden="true">+</span>{t.addMore}
        </button>
      )}
      <div className="rb-ord-total">
        <span className="rb-ord-total-label">{t.slipTotal}</span>
        <span className="rb-ord-total-value" data-bump={bump} data-quote={softTotal} aria-live="polite">
          {totalText}
        </span>
      </div>
      {/* The nudge only speaks past the halfway mark. A parent ordering one
          5.500 kr. barnaafmæliskaka must not be told to spend 44.500 kr.
          more; someone at 40.000 kr. is genuinely one kransakaka away. */}
      {VEISLUKJOR.discountPct > 0 && !kjor && !anyQuote && cakesSubtotal >= VEISLUKJOR.nudgeFrom && cakesSubtotal < VEISLUKJOR.threshold && (
        <p className="rb-ord-kjornudge">
          {t.kjorNudge(isk(VEISLUKJOR.threshold - cakesSubtotal), VEISLUKJOR.discountPct)}
        </p>
      )}
      {/* Below the nudge band the rule is simply STATED, so the threshold is
          knowable from the start rather than appearing out of nowhere once an
          order happens to get big enough. The nudge takes over from halfway. */}
      {VEISLUKJOR.discountPct > 0 && !kjor && !anyQuote && cakesSubtotal < VEISLUKJOR.nudgeFrom && (
        <p className="rb-ord-kjorinfo">
          {t.kjorRule(isk(VEISLUKJOR.threshold), VEISLUKJOR.discountPct)}
        </p>
      )}
      <p className="rb-ord-slip-note">{anyQuote ? t.quoteNote : t.slipNote}</p>
      {anyQuote && cakesSubtotal + extrasSum > 0 && (
        <p className="rb-ord-slip-note">{t.kjorQuoteNote}</p>
      )}
    </div>
  )

  return (
    <section
      id="order"
      style={{
        background: INK_DEEP,
        padding: standalone
          ? 'clamp(28px,5vh,48px) clamp(20px,4.5vw,72px) clamp(80px,11vh,140px)'
          : 'clamp(80px,11vh,140px) clamp(20px,4.5vw,72px)',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: ORDER_CSS }} />
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ borderTop: standalone ? 'none' : `1px solid ${HAIR}`, paddingTop: standalone ? 0 : 16, maxWidth: 640 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>
            {t.kicker}
          </div>
          {standalone ? (
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(38px,5.4vw,72px)', lineHeight: 1.02, margin: '18px 0 0', ...GOLD_TEXT }}>
              {t.title}
            </h1>
          ) : (
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT }}>
              {t.title}
            </h2>
          )}
          <p style={{ fontSize: 16, color: DIM, margin: '16px 0 0', lineHeight: 1.65 }}>{t.intro}</p>

          {PLACEHOLDER_DATA && (
            <div className="rb-ord-sample">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6.2" stroke={GOLD} strokeWidth="1.1" />
                <path d="M7 4v3.6" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="7" cy="10.1" r=".85" fill={GOLD} />
              </svg>
              <span>{t.sampleNotice}</span>
            </div>
          )}
        </div>

        {status === 'done' ? (
          <div className="rb-ord-done" style={{ marginTop: 'clamp(30px,4.5vh,46px)' }} role="status">
            <h3 className="rb-ord-done-title" style={{ ...GOLD_TEXT }}>{t.doneTitle}</h3>
            <p style={{ fontSize: 16, color: IVORY, lineHeight: 1.65, margin: '14px auto 0', maxWidth: '46ch' }}>{t.doneBody}</p>
            {/* Only claimed when the Worker says the receipt was accepted. */}
            {receiptSent && (
              <p style={{ fontSize: 14.5, color: DIM, lineHeight: 1.6, margin: '10px auto 0', maxWidth: '46ch' }}>
                {t.receiptSent(receiptSent)}
              </p>
            )}
            {/* WHEN, and how to reach us. Silence is the thing that makes an
                order feel lost: someone ordering on a Saturday evening cannot
                tell a slow reply from a failed submission. The hours phrase is
                built from the CMS hours, so it can never contradict the ones
                printed elsewhere on the site, and it degrades to a generic
                sentence if the week is not one single schedule. */}
            {/* One stub carrying the two facts worth keeping: what it costs and
                what to quote when ringing. Side by side, because a receipt is
                read at a glance and five centred paragraphs are not. */}
            <div className="rb-ord-stub">
              <div className="rb-ord-stub-cell">
                <span className="rb-ord-stub-key">{t.refLabel}</span>
                <span className="rb-ord-stub-val">{orderRef || '—'}</span>
              </div>
              <div className="rb-ord-stub-cell">
                <span className="rb-ord-stub-key">{t.slipTotal}</span>
                <span className="rb-ord-stub-val" data-price="true">
                  {quote ? t.quoteTotal : isk(total)}
                </span>
              </div>
            </div>

            {/* When we ring, and the number, on one line rather than two
                paragraphs saying nearly the same thing. */}
            <p className="rb-ord-done-line">
              {hoursRows[lang].length === 1
                ? t.doneWhen(`${hoursRows[lang][0].label.toLowerCase()} ${hoursRows[lang][0].value}`)
                : t.doneWhenGeneric}{' '}
              {t.doneReach}{' '}
              <a href={`tel:${LINKS.phone}`} className="rb-ord-tel">{LINKS.phoneLabel}</a>
            </p>

            {wantsPhoto && (
              photoDelivered ? (
                <p className="rb-ord-done-line" data-good="true">{t.photoSent}</p>
              ) : (
                orderRef && (
                  <p className="rb-ord-done-line">
                    {t.photoHow(orderRef)}{' '}
                    <a href={`mailto:${LINKS.orderEmail}?subject=${encodeURIComponent(orderRef)}`} className="rb-ord-tel">
                      {LINKS.orderEmail}
                    </a>
                  </p>
                )
              )
            )}

            <button type="button" className="rb-ord-submit" style={{ width: 'auto', marginTop: 24 }} onClick={reset}>
              {t.doneAgain}
            </button>
          </div>
        ) : (
          <form ref={formRef} className="rb-ord-grid" style={{ marginTop: 'clamp(24px,3.5vh,36px)' }} onSubmit={onSubmit} noValidate>
            <div className="rb-ord-formwrap">
              {/* running total, mobile only */}
              {/* The phone's version of the basket panel, and now of the
                  action too. Starbucks, Blank Street, Blue Apron and Skip all
                  keep the add button in a bar that never leaves the screen;
                  Skip's bar states what is still missing instead of a price
                  while the item is incomplete, which is the honest thing to
                  show. On a phone the customer never has to hunt for the
                  button, and the total is always in sight. */}
              <div className="rb-ord-mobiletotal">
                <span className="rb-ord-mobiletotal-label">
                  {basketCount > 0 ? t.basketCount(basketCount) : t.slipTotal}
                </span>
                <span className="rb-ord-mobiletotal-value" data-bump={bump} data-quote={softTotal} aria-live="polite">
                  {totalText}
                </span>
                {draftActive && (
                  missingRequired > 0
                    ? <span className="rb-ord-mobilemissing">{t.accMissing(missingRequired)}</span>
                    : (
                      <button type="button" className="rb-ord-mobileadd" onClick={commitDraft}>
                        {t.addToOrder}
                      </button>
                    )
                )}
              </div>

              {/* The context bar — who is ordering, and what for. Small and
                  FIRST, at the customer's request: it decides which fields
                  step 04 asks for and which occasion list is offered, and
                  knowing the occasion before the options means the writing-
                  on-the-cake field can suggest the right example — the
                  feature the restructure had quietly orphaned. One slim row,
                  because this is context, not a step: a segmented toggle and
                  a select, not lanes and chips. */}
              <div className="rb-ord-ctx" data-lanes={companyLane || undefined}>
                {/* The person/company toggle is gated, not deleted — see
                    COMPANY_ORDERS_ENABLED in order.ts. With one lane there is
                    nothing to segment, and a control with a single option is
                    just noise. */}
                {companyLane && (
                <div className="rb-ord-ctx-field">
                  <span className="rb-ord-ctx-label">{t.stepWho}</span>
                  <div className="rb-ord-seg" role="radiogroup" aria-label={t.stepWho}>
                    {([
                      { id: 'person' as const, name: t.whoPerson },
                      { id: 'company' as const, name: t.whoCompany },
                    ]).map((o) => (
                      <label key={o.id} data-on={who === o.id}>
                        <input
                          type="radio"
                          name="rb-ord-who"
                          checked={who === o.id}
                          onChange={() => setWho(o.id)}
                        />
                        <span>{o.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                )}
                {askOccasion && (
                  <div className="rb-ord-ctx-field">
                    <label className="rb-ord-ctx-label" htmlFor="rb-ord-occasion">
                      {t.fieldOccasion} · {t.optional}
                    </label>
                    {/* A select, not chips: eight options in one slim control,
                        and the empty option is how "optional" stays true. */}
                    <select
                      id="rb-ord-occasion"
                      className="rb-ord-select rb-ord-ctx-select"
                      value={customer.occasion}
                      onChange={(e) => setCustomer((c) => ({ ...c, occasion: e.target.value, occasionOther: '' }))}
                    >
                      <option value="" style={{ background: INK }}>{t.occasionNone}</option>
                      {occasionList.map((o) => (
                        <option key={o.id} value={o.id} style={{ background: INK }}>{o.label[lang]}</option>
                      ))}
                    </select>
                  </div>
                )}
                {occasion?.freeText && (
                  <div className="rb-ord-ctx-field" style={{ flex: '1 1 220px' }}>
                    <label className="rb-ord-ctx-label" htmlFor="rb-ord-occasion-other">{t.occasionOtherLabel}</label>
                    <input
                      id="rb-ord-occasion-other"
                      className="rb-ord-input"
                      type="text"
                      maxLength={90}
                      placeholder={t.occasionOtherPlaceholder}
                      value={customer.occasionOther}
                      data-invalid={showErr('occasionOther') ? 'true' : undefined}
                      aria-invalid={!!showErr('occasionOther')}
                      onChange={(e) => setCustomer((c) => ({ ...c, occasionOther: e.target.value }))}
                      onBlur={() => setTouched((prev) => ({ ...prev, occasionOther: true }))}
                    />
                    {showErr('occasionOther') && (
                      <p className="rb-ord-err" role="alert">{t.errOccasionOther}</p>
                    )}
                  </div>
                )}
              </div>
              {who === 'company' && <p className="rb-ord-help" style={{ margin: '10px 0 0' }}>{t.bigOrderNote}</p>}

              {/* 01 — the cakes. The form opens with the thing the customer
                  came for. */}
              <div className="rb-ord-step">
                <div className="rb-ord-stephead">
                  <span className="rb-ord-stepnum" aria-hidden="true">01</span>
                  <span className="rb-ord-steplabel">{t.stepProduct}</span>
                </div>
                <div
                  ref={rangeRef}
                  className="rb-ord-prods"
                  role="radiogroup"
                  aria-label={t.stepProduct}
                  /* The dock spans the form column, so it carries up to four. */
                  style={{ ['--prod-cols' as string]: String(columnsFor(ORDER_PRODUCTS.length, 4)) }}
                >
                  {ORDER_PRODUCTS.map((p) => (
                    <label key={p.id} className="rb-ord-prod" data-on={p.id === productId}>
                      <input
                        type="radio"
                        name="rb-ord-product"
                        value={p.id}
                        checked={draftActive && p.id === productId}
                        onChange={() => { setProductId(p.id); setDraftActive(true) }}
                      />
                      <span className="rb-ord-prod-mark" aria-hidden="true"><Check /></span>
                      {showPics && p.image && (
                        <span className="rb-ord-prod-pic">
                          <img src={p.image} alt="" loading="lazy" decoding="async" width={1400} height={1400} />
                        </span>
                      )}
                      <span className="rb-ord-prod-name">{p.name[lang]}</span>
                      <span className="rb-ord-prod-from">
                        {p.pricePerPerson
                          ? `${isk(p.pricePerPerson)} ${t.perPerson}`
                          : fromPriceOf(p) > 0 ? `${lang === 'is' ? 'frá' : 'from'} ${isk(fromPriceOf(p))}` : (lang === 'is' ? 'Tilboð' : 'Quote')}
                      </span>
                    </label>
                  ))}
                </div>
                {/* Between cakes the picker sits deselected and says so; the
                    blurb belongs to a cake actually being configured. */}
                <p className="rb-ord-help" style={{ marginTop: 12 }}>
                  {draftActive ? product.blurb[lang] : t.pickNextCake}
                </p>
                {/* What Nings answers with its header basket turning into
                    "1 HLUTUR · 1.490 KR.": adding has to be confirmed in
                    words, not only by a row appearing in a panel that is
                    below the fold on a phone. Keyed on the counter so adding
                    the same product twice re-announces and re-plays. */}
                <p className="rb-ord-added" role="status">
                  <span key={justAdded?.n ?? 0}>
                    {justAdded && !draftActive ? t.addedToOrder(justAdded.name) : '\u00a0'}
                  </span>
                </p>
                {showErr('g_product') && <p className="rb-ord-err" role="alert">{errors.g_product}</p>}
              </div>

              {/* 4 — options. Only while a cake is being configured: between
                  committing one cake and choosing the next there is nothing
                  to option. */}
              {draftActive && (
              <div className="rb-ord-step">
                <div className="rb-ord-steplabel">{t.stepOptions}</div>
                <div className="rb-ord-groups" data-key={product.id} key={product.id}>
                  {sizeGroup && renderGroup(sizeGroup)}
                  <div className="rb-ord-acclist">
                    {accGroups.map((group) => {
                      const answer = groupAnswer(group)
                      const open = openGroup === group.id
                      const gErr = showErr(`g_${group.id}`)
                      return (
                        <div className="rb-ord-acc" key={group.id} data-open={open || undefined} data-err={gErr ? 'true' : undefined}>
                          <button
                            type="button"
                            className="rb-ord-acc-head"
                            aria-expanded={open}
                            aria-controls={`acc_${group.id}`}
                            onClick={() => setOpenGroup(open ? null : group.id)}
                          >
                            <span className="rb-ord-acc-q">
                              {group.label[lang]}
                              {group.required && !answer && <span className="rb-ord-acc-req">{t.required}</span>}
                            </span>
                            {/* The answer, or a prompt. Never both, and never
                                empty: a row that says nothing on the right is
                                a row you have to open to understand. */}
                            <span className="rb-ord-acc-a" data-empty={!answer || undefined}>
                              {answer || (group.required ? t.accChoose : t.optional)}
                            </span>
                            <span className="rb-ord-acc-chev" aria-hidden="true" />
                          </button>
                          {open && (
                            <div className="rb-ord-acc-body" id={`acc_${group.id}`}>
                              {renderGroup(group, { bare: true })}
                            </div>
                          )}
                          {/* A closed question cannot show its own error inside
                              itself, and an error nobody can see is why the
                              button would refuse with nothing on screen. */}
                          {gErr && !open && <p className="rb-ord-err" role="alert">{gErr}</p>}
                        </div>
                      )
                    })}
                  </div>

                  {product.inscription && (
                    <div className="rb-ord-field">
                      <label className="rb-ord-label" htmlFor="rb-ord-inscription">
                        {product.inscription.label[lang]}
                        <span className="rb-ord-tag">{t.optional}</span>
                      </label>
                      <input
                        id="rb-ord-inscription"
                        className="rb-ord-input"
                        type="text"
                        maxLength={product.inscription.maxLength}
                        /* The occasion writes the example. "Til hamingju Emma,
                           6 ára" is a far better prompt than a generic one,
                           and it is the difference between a field people fill
                           in and one they skip.

                           Once an occasion IS picked the product's own
                           placeholder is never used again, even as a fallback.
                           The marsipanterta's is "Til hamingju með 50 ára
                           afmælið", so falling back to it offered a funeral
                           reception congratulations. An occasion with nothing
                           cheerful to say gets a neutral line instead. */
                        placeholder={
                          occasion
                            ? (occasion.suggests?.[lang] ?? t.inscriptionNeutral)
                            : product.inscription.placeholder[lang]
                        }
                        value={inscription}
                        onChange={(e) => setInscription(e.target.value)}
                      />
                      <p className="rb-ord-hint">{t.charsLeft(product.inscription.maxLength - inscription.length)}</p>
                    </div>
                  )}

                  <div className="rb-ord-field">
                    <span className="rb-ord-label" id="rb-ord-qty-label">{t.fieldQty}</span>
                    <div className="rb-ord-qty" role="group" aria-labelledby="rb-ord-qty-label">
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={lang === 'is' ? 'Fækka kökum' : 'Remove one cake'}>−</button>
                      <span className="rb-ord-qty-val" aria-live="polite">{qty}</span>
                      <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} disabled={qty >= 99} aria-label={lang === 'is' ? 'Bæta við köku' : 'Add one cake'}>+</button>
                    </div>
                    <p className="rb-ord-hint">{t.fieldQtyHint}</p>
                  </div>

                  {/* One order can hold the whole event — the ferming needs a
                      marsipanterta AND a kransakaka, and splitting that into
                      two orders meant two references and two phone calls.
                      Committing here snapshots this cake into the slip exactly
                      as priced, then hands the picker back. */}
                  <div className="rb-ord-addcake">
                    {/* nings.is puts the quantity, the running total and one
                        filled "Setja í körfu" in a single bar at the end of the
                        product; the total ON the button is what makes it a
                        commitment rather than a link. Ours carries the same
                        three, and says "Tilboð" instead of a number when the
                        cake is a quote — a bespoke cake has no total to show. */}
                    <button type="button" className="rb-ord-addbtn" onClick={commitDraft}>
                      <span>{t.addToOrder}</span>
                      {!unpriced && <span className="rb-ord-addbtn-sum">{quote ? t.quoteTotal : isk(total)}</span>}
                    </button>
                    {cakes.length > 0 && (
                      <button type="button" className="rb-ord-linkbtn" onClick={cancelDraft}>{t.cancelDraftCake}</button>
                    )}
                  </div>
                </div>
              </div>
              )}

              {/* Counter extras — no longer a numbered step of their own.
                  Þorleifur asked for fewer steps (call 2026-09-18) and for one
                  basket you keep adding to, and nings.is, DoorDash and Uber
                  Eats all model that the same way: ONE range with shelves in
                  it, not a step per shelf. Numbering them 02 also implied the
                  customer had to pass through pastries to reach the date.

                  The kjör price still takes over automatically at the
                  threshold, and every figure on that side is a PLACEHOLDER
                  until the owner sets real ones — see VEISLUKJOR in order.ts. */}
              <div className="rb-ord-shelf">
                <div className="rb-ord-shelfhead">
                  <span className="rb-ord-steplabel">{t.stepExtras}</span>
                  <span className="rb-ord-shelfrule" aria-hidden="true" />
                </div>
                <p className="rb-ord-help" style={{ marginTop: 10 }}>{kjor ? t.extrasKjorIntro : lang === 'is' ? 'Bættu bakkelsi við pöntunina ef þú vilt.' : 'Add pastries to your order if you like.'}</p>
                {/* Photo cards, not text rows — the sweetgreen add-on
                    pattern: the product is the photograph and the stepper
                    lives ON the card it counts. Skinned to this page's
                    language (ink ground, hairline border, Lusitana, gold
                    when active), not the reference's white cards. */}
                {/* One column: a shelf reads as a list. The column count the
                    card grid needed is gone with the cards. */}
                <div className="rb-ord-extras">
                  {ORDER_EXTRAS.map((ex) => {
                    const nQty = extrasQty[ex.id] ?? 0
                    const unit = extraUnitPrice(ex, nQty, kjor)
                    const cut = unit < ex.unitPrice
                    return (
                      <div className="rb-ord-shelfitem" key={ex.id} data-on={nQty > 0 || undefined}>
                        {ex.image && (
                          <span className="rb-ord-shelfitem-pic" aria-hidden="true">
                            <img src={ex.image} alt="" loading="lazy" decoding="async" width={480} height={480} />
                          </span>
                        )}
                        {/* Name, price and the quantity break in one column;
                            the stepper is the grid's THIRD child, not a child
                            of that column — nested, it stacked under the text
                            and made a 48px thumbnail row 120px tall. */}
                        <span className="rb-ord-shelfitem-body">
                          <span className="rb-ord-shelfitem-name">{ex.label[lang]}</span>
                          <span className="rb-ord-shelfitem-price">
                            {cut ? (
                              <>
                                <s>{isk(ex.unitPrice)}</s> {isk(ex.kjorPrice)}
                                <em>{kjor ? t.extrasKjorTag : t.extrasBulkTag}</em>
                              </>
                            ) : (
                              `${isk(ex.unitPrice)} ${lang === 'is' ? 'stk.' : 'each'}`
                            )}
                          </span>
                          {/* The case price is ADVERTISED, not hidden behind the
                              crossing — people order these by the tray for
                              events, so the row sells the bulk. Once the cut is
                              live the line has done its job and goes. */}
                          <span className="rb-ord-shelfitem-bulk">
                            {cut || !Number.isFinite(ex.bulkAt) ? '' : t.extrasBulkLine(ex.bulkAt, isk(ex.kjorPrice))}
                          </span>
                        </span>
                        {/* No line total here: the basket beside this carries
                            every total, and the running total follows the
                            customer down the phone in the sticky strip. */}
                        <span className="rb-ord-qty" data-small="true" role="group" aria-label={ex.label[lang]}>
                          <button type="button" onClick={() => stepExtra(ex.id, -1)} disabled={nQty <= 0} aria-label={`${lang === 'is' ? 'Fækka' : 'Remove'} ${ex.label[lang]}`}>−</button>
                          <span className="rb-ord-qty-val" aria-live="polite">{nQty}</span>
                          <button type="button" onClick={() => stepExtra(ex.id, 1)} disabled={nQty >= ex.max} aria-label={`${lang === 'is' ? 'Bæta við' : 'Add'} ${ex.label[lang]}`}>+</button>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 03 — when and where. Pulled OUT of the contact blob it used
                  to hide in: for a bakery with 48 hours' notice, the date is
                  the one field that decides whether the order is possible at
                  all, and it was buried below a kennitala. Crumbl gives this
                  moment its own screen; here it gets its own numbered step. */}
              <div className="rb-ord-step">
                <div className="rb-ord-stephead">
                  <span className="rb-ord-stepnum" aria-hidden="true">02</span>
                  <span className="rb-ord-steplabel">{t.stepWhen}</span>
                </div>
                <div className="rb-ord-two">
                  <div className="rb-ord-field">
                    <label className="rb-ord-label" htmlFor="rb-ord-date">{t.fieldDate}</label>
                    <input
                      id="rb-ord-date"
                      className="rb-ord-input"
                      type="date"
                      min={earliest || undefined}
                      value={customer.date}
                      data-invalid={showErr('c_date') ? 'true' : undefined}
                      aria-invalid={!!showErr('c_date')}
                      aria-describedby={showErr('c_date') ? 'err_c_date' : 'hint_c_date'}
                      onChange={(e) => setCustomer({ ...customer, date: e.target.value, time: '' })}
                      onBlur={() => setTouched({ ...touched, c_date: true })}
                    />
                    {showErr('c_date')
                      ? <p className="rb-ord-err" id="err_c_date" role="alert">{showErr('c_date')}</p>
                      : <p className="rb-ord-hint" id="hint_c_date">{t.fieldDateHelp(Math.max(...requiredNotice.map(p => p.leadDays), 0))}</p>}
                  </div>

                  <div className="rb-ord-field">
                    <label className="rb-ord-label" htmlFor="rb-ord-time">{t.fieldTime}</label>
                    <select
                      id="rb-ord-time"
                      className="rb-ord-select"
                      value={customer.time}
                      data-invalid={showErr('c_time') ? 'true' : undefined}
                      aria-invalid={!!showErr('c_time')}
                      aria-describedby={showErr('c_time') ? 'err_c_time' : 'hint_c_time'}
                      onChange={(e) => setCustomer({ ...customer, time: e.target.value })}
                      onBlur={() => setTouched({ ...touched, c_time: true })}
                    >
                      <option value="">{t.fieldTimePlaceholder}</option>
                      {slots.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {showErr('c_time')
                      ? <p className="rb-ord-err" id="err_c_time" role="alert">{showErr('c_time')}</p>
                      : <p className="rb-ord-hint" id="hint_c_time">{customer.date && !slots.length ? (lang === 'is' ? 'Engir afhendingartímar í boði þennan dag. Veldu annan dag.' : 'No collection times available on this date. Choose another day.') : (lang === 'is' ? 'Tímarnir miðast við opnun og fyrirvara pöntunarinnar.' : 'Times follow opening hours and the notice required for your order.')}</p>}
                  </div>
                </div>

                <div className="rb-ord-two">
                  {who === 'company' ? (
                    <div className="rb-ord-field">
                      <label className="rb-ord-label" htmlFor="rb-ord-handover">{t.fieldHandover}</label>
                      <select
                        id="rb-ord-handover"
                        className="rb-ord-select"
                        value={customer.handover}
                        onChange={(e) => setCustomer({ ...customer, handover: e.target.value as 'pickup' | 'delivery' })}
                      >
                        <option value="pickup" style={{ background: INK }}>{t.handoverPickup}</option>
                        <option value="delivery" style={{ background: INK }}>{t.handoverDelivery}</option>
                      </select>
                    </div>
                  ) : (
                    <div className="rb-ord-field">
                      {PICKUP_LOCATIONS.length > 1 ? (
                        <>
                          <label className="rb-ord-label" htmlFor="rb-ord-location">{t.fieldLocation}</label>
                          <select
                            id="rb-ord-location"
                            className="rb-ord-select"
                            value={customer.location}
                            onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
                          >
                            {PICKUP_LOCATIONS.map((l) => (
                              <option key={l.id} value={l.id} style={{ background: INK }}>{l.label[lang]}</option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <>
                          <span className="rb-ord-label">{t.fieldLocation}</span>
                          <div className="rb-ord-readout">{PICKUP_LOCATIONS[0].label[lang]}</div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {who === 'company' && customer.handover === 'pickup' && (
                  <div className="rb-ord-field">
                    {PICKUP_LOCATIONS.length > 1 ? (
                      <>
                        <label className="rb-ord-label" htmlFor="rb-ord-location-co">{t.fieldLocation}</label>
                        <select
                          id="rb-ord-location-co"
                          className="rb-ord-select"
                          value={customer.location}
                          onChange={(e) => setCustomer({ ...customer, location: e.target.value })}
                        >
                          {PICKUP_LOCATIONS.map((l) => (
                            <option key={l.id} value={l.id} style={{ background: INK }}>{l.label[lang]}</option>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <span className="rb-ord-label">{t.fieldLocation}</span>
                        <div className="rb-ord-readout">{PICKUP_LOCATIONS[0].label[lang]}</div>
                      </>
                    )}
                  </div>
                )}

                {who === 'company' && customer.handover === 'delivery' && (
                  <div className="rb-ord-field">
                    <label className="rb-ord-label" htmlFor="rb-ord-address">{t.fieldAddress}</label>
                    <input
                      id="rb-ord-address"
                      className="rb-ord-input"
                      type="text"
                      autoComplete="street-address"
                      value={customer.address}
                      data-invalid={showErr('c_address') ? 'true' : undefined}
                      aria-invalid={!!showErr('c_address')}
                      aria-describedby={showErr('c_address') ? 'err_c_address' : 'hint_c_address'}
                      onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                      onBlur={() => setTouched({ ...touched, c_address: true })}
                    />
                    {showErr('c_address')
                      ? <p className="rb-ord-err" id="err_c_address" role="alert">{showErr('c_address')}</p>
                      : <p className="rb-ord-hint" id="hint_c_address">{t.fieldAddressHint}</p>}
                  </div>
                )}

              </div>

              {/* 04 — who is ordering. LAST, where every reference puts
                  identity: nobody arrives at a bakery form to declare their
                  legal status. The person/company lanes decide which fields
                  follow AND which occasion list is offered, so the occasion
                  chips live directly under them. */}
              <div className="rb-ord-step">
                <div className="rb-ord-stephead">
                  <span className="rb-ord-stepnum" aria-hidden="true">03</span>
                  <span className="rb-ord-steplabel">{t.stepDetails}</span>
                </div>

                {cakes.some(c => c.wantsPhoto && !c.photo) && <p className="rb-ord-hint">{lang === 'is' ? 'Til að bæta mynd við ákveðna köku skaltu velja Breyta við þá köku. Þú getur líka sent myndina síðar með pöntunarnúmerinu.' : 'Choose Edit on a cake to attach its photograph, or send it later with your order reference.'}</p>}

                {who === 'company' && (
                  <>
                    <div className="rb-ord-two" style={{ marginTop: 4 }}>
                      <div className="rb-ord-field">
                        <label className="rb-ord-label" htmlFor="rb-ord-company">{t.fieldCompany}</label>
                        <input
                          id="rb-ord-company"
                          className="rb-ord-input"
                          type="text"
                          autoComplete="organization"
                          value={customer.company}
                          data-invalid={showErr('c_company') ? 'true' : undefined}
                          aria-invalid={!!showErr('c_company')}
                          aria-describedby={showErr('c_company') ? 'err_c_company' : undefined}
                          onChange={(e) => setCustomer({ ...customer, company: e.target.value })}
                          onBlur={() => setTouched({ ...touched, c_company: true })}
                        />
                        {showErr('c_company') && <p className="rb-ord-err" id="err_c_company" role="alert">{showErr('c_company')}</p>}
                      </div>

                      <div className="rb-ord-field">
                        <label className="rb-ord-label" htmlFor="rb-ord-kennitala">{t.fieldKennitala}</label>
                        <input
                          id="rb-ord-kennitala"
                          className="rb-ord-input"
                          type="text"
                          inputMode="numeric"
                          value={customer.kennitala}
                          data-invalid={showErr('c_kennitala') ? 'true' : undefined}
                          aria-invalid={!!showErr('c_kennitala')}
                          aria-describedby={showErr('c_kennitala') ? 'err_c_kennitala' : 'hint_c_kennitala'}
                          onChange={(e) => setCustomer({ ...customer, kennitala: e.target.value })}
                          onBlur={() => setTouched({ ...touched, c_kennitala: true })}
                        />
                        {showErr('c_kennitala')
                          ? <p className="rb-ord-err" id="err_c_kennitala" role="alert">{showErr('c_kennitala')}</p>
                          : <p className="rb-ord-hint" id="hint_c_kennitala">{t.fieldKennitalaHint}</p>}
                      </div>
                    </div>

                    {/* The occasion used to sit here, beside the guest count.
                        It moved up to its own step: it is a fact about the
                        order, not an administrative detail, and both private
                        and company customers are asked it now. */}
                    <div className="rb-ord-two">
                      <div className="rb-ord-field">
                        <label className="rb-ord-label" htmlFor="rb-ord-guests">{t.fieldGuests}</label>
                        <input
                          id="rb-ord-guests"
                          className="rb-ord-input"
                          type="number"
                          inputMode="numeric"
                          min={1}
                          value={customer.guests}
                          aria-describedby="hint_c_guests"
                          onChange={(e) => setCustomer({ ...customer, guests: e.target.value })}
                        />
                        <p className="rb-ord-hint" id="hint_c_guests">{t.fieldGuestsHint}</p>
                      </div>
                    </div>
                  </>
                )}

                <div className="rb-ord-two" style={{ marginTop: 4 }}>
                  {who === 'person' ? (
                    <div className="rb-ord-field">
                      <label className="rb-ord-label" htmlFor="rb-ord-name">{t.fieldName}</label>
                      <input
                        id="rb-ord-name"
                        className="rb-ord-input"
                        type="text"
                        autoComplete="name"
                        value={customer.name}
                        data-invalid={showErr('c_name') ? 'true' : undefined}
                        aria-invalid={!!showErr('c_name')}
                        aria-describedby={showErr('c_name') ? 'err_c_name' : undefined}
                        onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                        onBlur={() => setTouched({ ...touched, c_name: true })}
                      />
                      {showErr('c_name') && <p className="rb-ord-err" id="err_c_name" role="alert">{showErr('c_name')}</p>}
                    </div>
                  ) : (
                    <div className="rb-ord-field">
                      <label className="rb-ord-label" htmlFor="rb-ord-contact">{t.fieldContact}</label>
                      <input
                        id="rb-ord-contact"
                        className="rb-ord-input"
                        type="text"
                        autoComplete="name"
                        value={customer.contact}
                        data-invalid={showErr('c_contact') ? 'true' : undefined}
                        aria-invalid={!!showErr('c_contact')}
                        aria-describedby={showErr('c_contact') ? 'err_c_contact' : undefined}
                        onChange={(e) => setCustomer({ ...customer, contact: e.target.value })}
                        onBlur={() => setTouched({ ...touched, c_contact: true })}
                      />
                      {showErr('c_contact') && <p className="rb-ord-err" id="err_c_contact" role="alert">{showErr('c_contact')}</p>}
                    </div>
                  )}

                  <div className="rb-ord-field">
                    <label className="rb-ord-label" htmlFor="rb-ord-phone">{t.fieldPhone}</label>
                    <input
                      id="rb-ord-phone"
                      className="rb-ord-input"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={customer.phone}
                      data-invalid={showErr('c_phone') ? 'true' : undefined}
                      aria-invalid={!!showErr('c_phone')}
                      aria-describedby={showErr('c_phone') ? 'err_c_phone' : undefined}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      onBlur={() => setTouched({ ...touched, c_phone: true })}
                    />
                    {showErr('c_phone') && <p className="rb-ord-err" id="err_c_phone" role="alert">{showErr('c_phone')}</p>}
                  </div>
                </div>

                <div className="rb-ord-field">
                  <label className="rb-ord-label" htmlFor="rb-ord-email">{t.fieldEmail}</label>
                  <input
                    id="rb-ord-email"
                    className="rb-ord-input"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={customer.email}
                    data-invalid={showErr('c_email') ? 'true' : undefined}
                    aria-invalid={!!showErr('c_email')}
                    aria-describedby={showErr('c_email') ? 'err_c_email' : 'hint_c_email'}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    onBlur={() => setTouched({ ...touched, c_email: true })}
                  />
                  {showErr('c_email')
                    ? <p className="rb-ord-err" id="err_c_email" role="alert">{showErr('c_email')}</p>
                    : <p className="rb-ord-hint" id="hint_c_email">{t.fieldEmailHelp}</p>}
                </div>

                {who === 'company' && (
                  <div className="rb-ord-field">
                    <label className="rb-ord-label" htmlFor="rb-ord-invoice-email">
                      {t.fieldInvoiceEmail}
                      <span className="rb-ord-tag">{t.optional}</span>
                    </label>
                    <input
                      id="rb-ord-invoice-email"
                      className="rb-ord-input"
                      type="email"
                      inputMode="email"
                      value={customer.invoiceEmail}
                      data-invalid={showErr('c_invoiceEmail') ? 'true' : undefined}
                      aria-invalid={!!showErr('c_invoiceEmail')}
                      aria-describedby={showErr('c_invoiceEmail') ? 'err_c_invoiceEmail' : 'hint_c_invoiceEmail'}
                      onChange={(e) => setCustomer({ ...customer, invoiceEmail: e.target.value })}
                      onBlur={() => setTouched({ ...touched, c_invoiceEmail: true })}
                    />
                    {showErr('c_invoiceEmail')
                      ? <p className="rb-ord-err" id="err_c_invoiceEmail" role="alert">{showErr('c_invoiceEmail')}</p>
                      : <p className="rb-ord-hint" id="hint_c_invoiceEmail">{t.fieldInvoiceEmailHint}</p>}
                  </div>
                )}

                <div className="rb-ord-field">
                  <label className="rb-ord-label" htmlFor="rb-ord-notes">
                    {t.fieldNotes}
                    <span className="rb-ord-tag">{t.optional}</span>
                  </label>
                  <textarea
                    id="rb-ord-notes"
                    className="rb-ord-textarea"
                    placeholder={t.fieldNotesPlaceholder}
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  />
                </div>

                <button type="submit" className="rb-ord-submit" disabled={status === 'sending'}>
                  {status === 'sending' ? `${t.submitting}...` : quote ? t.submitQuote : t.submit}
                </button>
                {/* Stable live region: it exists from the first failed press on,
                    so a screen reader hears the list change rather than a new
                    alert every time one item is fixed. */}
                {triedSubmit && (
                  <div className="rb-ord-issues" aria-live="polite" data-empty={issues.length === 0 || undefined}>
                    {issues.length > 0 && (
                      <>
                        <p className="rb-ord-issues-head">{t.issuesHead(issues.length)}</p>
                        <ul className="rb-ord-issues-list">
                          {issues.map((it) => (
                            <li key={it.key}>
                              <button type="button" className="rb-ord-issue" onClick={() => jumpTo(it.key)}>
                                <span className="rb-ord-issue-what">{it.label}</span>
                                <span className="rb-ord-issue-why">{it.why}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                )}
                {sendError && (
                  <p className="rb-ord-errsummary" role="alert">
                    {lang === 'is'
                      ? 'Ekki tókst að staðfesta móttöku beiðninnar. Reyndu aftur eða hringdu í '
                      : 'We could not verify receipt of your request. Retry or call us on '}
                    <a href={`tel:${LINKS.phone}`} className="rb-ord-tel">{LINKS.phoneLabel}</a>
                    {lang === 'is' ? ' og gefðu upp númerið ' : ' and quote reference '}{orderRef}
                  </p>
                )}
                <p className="rb-ord-hint" style={{ textAlign: 'center', marginTop: 4 }}>
                  {lang === 'is' ? 'Eða hringdu í ' : 'Or call us on '}
                  <a href={`tel:${LINKS.phone}`} className="rb-ord-tel">{LINKS.phoneLabel}</a>
                </p>
              </div>
            </div>

            <div className="rb-ord-slipwrap">{slip}</div>
          </form>
        )}
        {reviewing && typeof document !== 'undefined' && createPortal((() => {
          const all: CakeInOrder[] = [...cakes, ...(draftActive ? [snapshotDraft()] : [])]
          const loc = PICKUP_LOCATIONS.find((l) => l.id === customer.location)?.label[lang] ?? ''
          const delivering = who === 'company' && customer.handover === 'delivery'
          const extrasIn = ORDER_EXTRAS.filter((ex) => (extrasQty[ex.id] ?? 0) > 0)
          const send = () => {
            confirmedRef.current = true
            setReviewing(false)
            formRef.current?.requestSubmit()
          }
          return (
            <div className="rb-ord-review-scrim" onClick={() => closeReview()}>
              <div
                ref={reviewRef}
                className="rb-ord-review"
                role="dialog"
                aria-modal="true"
                aria-labelledby="rb-ord-review-title"
                tabIndex={-1}
                onClick={(e) => e.stopPropagation()}
              >
                <p className="rb-ord-review-kicker">{t.reviewKicker}</p>
                <h2 id="rb-ord-review-title" className="rb-ord-review-title" style={GOLD_TEXT}>{t.reviewTitle}</h2>
                <p className="rb-ord-review-lede">{t.reviewLede}</p>

                <dl className="rb-ord-review-when">
                  <div>
                    <dt>{t.fieldDate}</dt>
                    <dd>{prettyDateFull(customer.date, lang)}, {lang === 'is' ? 'kl.' : 'at'} {customer.time}</dd>
                  </div>
                  <div>
                    <dt>{delivering ? t.fieldAddress : t.fieldLocation}</dt>
                    <dd>{delivering ? customer.address : loc}</dd>
                  </div>
                </dl>

                <div className="rb-ord-review-items">
                  {all.map((c) => (
                    <div className="rb-ord-review-item" key={c.key}>
                      <div className="rb-ord-review-top">
                        <span className="rb-ord-review-name">{c.product.name[lang]}</span>
                        <span className="rb-ord-review-price">{c.quote ? t.quoteTotal : isk(c.total)}</span>
                      </div>
                      {specsOf(c).length > 0 && (
                        <dl className="rb-ord-row-specs">
                          {specsOf(c).map((sp) => (
                            <div key={sp.key}>
                              {sp.label && <dt>{sp.label}</dt>}
                              <dd>{sp.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  ))}
                  {extrasIn.map((ex) => {
                    const q = extrasQty[ex.id] ?? 0
                    return (
                      <div className="rb-ord-review-item" key={ex.id}>
                        <div className="rb-ord-review-top">
                          <span className="rb-ord-review-name">{ex.label[lang]} × {q}</span>
                          <span className="rb-ord-review-price">{isk(q * extraUnitPrice(ex, q, kjor))}</span>
                        </div>
                      </div>
                    )
                  })}
                  <div className="rb-ord-review-total">
                    <span>{t.slipTotal}</span>
                    <span>{totalText}</span>
                  </div>
                </div>

                <dl className="rb-ord-review-when">
                  <div>
                    <dt>{who === 'company' ? t.fieldCompany : t.fieldName}</dt>
                    <dd>{who === 'company' ? `${customer.company} · ${customer.contact}` : customer.name}</dd>
                  </div>
                  <div>
                    <dt>{t.fieldPhone}</dt>
                    <dd>{customer.phone}{customer.email.trim() ? ` · ${customer.email.trim()}` : ''}</dd>
                  </div>
                  {customer.notes.trim() && (
                    <div className="rb-ord-review-wide">
                      <dt>{t.fieldNotes}</dt>
                      <dd>{customer.notes.trim()}</dd>
                    </div>
                  )}
                </dl>

                <div className="rb-ord-review-acts">
                  <button type="button" className="rb-ord-submit rb-ord-review-send" onClick={send}>
                    {anyQuote ? t.submitQuote : t.reviewSend}
                  </button>
                  <button type="button" className="rb-ord-review-edit" onClick={() => closeReview()}>
                    {t.reviewEdit}
                  </button>
                </div>
              </div>
            </div>
          )
        })(), document.body)}
      </div>
    </section>
  )
}
