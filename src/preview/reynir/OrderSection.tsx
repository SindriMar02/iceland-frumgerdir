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
import type { Lang } from './data'
import {
  ORDER_FORM_TO,
  ORDER_T,
  PLACEHOLDER_DATA,
  isk,
  type OrderGroup,
  type OrderProduct,
} from './order'
import { BODY, DIM, DISPLAY, EASE, FAINT, GOLD, GOLD_LIGHT, GOLD_TEXT, HAIR, HAIR_SOFT, INK, INK_DEEP, IVORY } from './tokens'
import { useSiteContent } from './sanity'

const ORDER_CSS = `
  /* layout: functional split, the slip reacts to the choices */
  .rb-ord-grid { display:grid; grid-template-columns:minmax(0,1fr) 360px; gap:clamp(28px,4vw,64px); align-items:start; }

  .rb-ord-step { border-top:1px solid ${HAIR}; padding-top:18px; margin-top:clamp(30px,4.5vh,46px); }
  .rb-ord-steplabel { font-size:12px; font-weight:700; letter-spacing:.2em; text-transform:uppercase; color:${GOLD}; }

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
  .rb-ord-prods { display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-top:16px; }
  .rb-ord-prods > * { flex:1 1 210px; max-width:calc(33.333% - 7px); }
  .rb-ord-prod { position:relative; display:flex; flex-direction:column; gap:6px; text-align:left; cursor:pointer;
    padding:16px 15px; border:1px solid ${HAIR}; border-radius:4px; background:rgba(243,234,211,.02);
    overflow:hidden;
    transition:border-color .22s ${EASE}, background .22s ${EASE}, transform .16s ${EASE}; }
  /* Product photo. The card is built so this can be absent — a product added
     in the CMS before its picture exists simply renders the text card. */
  .rb-ord-prod-pic { margin:-16px -15px 10px; aspect-ratio:1 / 1; overflow:hidden; background:${INK}; }
  .rb-ord-prod-pic img { width:100%; height:100%; object-fit:cover; display:block;
    filter:saturate(.96) brightness(.94); transition:transform .5s ${EASE}, filter .35s ${EASE}; }
  .rb-ord-prod:hover .rb-ord-prod-pic img { transform:scale(1.04); filter:saturate(1) brightness(1); }
  .rb-ord-prod[data-on="true"] .rb-ord-prod-pic img { filter:saturate(1) brightness(1); }
  .rb-ord-prod:hover { border-color:rgba(238,211,170,.4); background:rgba(243,234,211,.05); }
  .rb-ord-prod:active { transform:scale(.99); }
  .rb-ord-prod[data-on="true"] { border-color:${GOLD}; background:rgba(200,168,119,.09); }
  .rb-ord-prod-name { font-family:${DISPLAY}; font-size:19px; line-height:1.15; color:${IVORY}; padding-right:24px; }
  .rb-ord-prod[data-on="true"] .rb-ord-prod-name { color:${GOLD_LIGHT}; }
  .rb-ord-prod-from { font-size:12.5px; color:${DIM}; font-variant-numeric:tabular-nums; }
  /* z-index is load-bearing, not decoration: the product photo carries a
     filter, which gives it its own stacking context, and a stacking context
     with z-index:auto paints in the positioned layer in DOM order — putting
     the later <img> on top of this earlier absolute mark and hiding the
     selected state entirely. The ring behind it keeps the mark legible over
     a photograph rather than only over the dark card. */
  .rb-ord-prod-mark { position:absolute; z-index:2; top:14px; right:14px; width:17px; height:17px; border-radius:50%;
    border:1px solid rgba(238,211,170,.55); display:flex; align-items:center; justify-content:center;
    background:rgba(11,10,9,.45); box-shadow:0 0 0 3px rgba(11,10,9,.35);
    transition:border-color .2s ${EASE}, background .2s ${EASE}; }
  .rb-ord-prod[data-on="true"] .rb-ord-prod-mark { border-color:${GOLD}; background:${GOLD}; }
  .rb-ord-prod-mark svg { opacity:0; transform:scale(.6); transition:opacity .18s ${EASE}, transform .18s ${EASE}; }
  .rb-ord-prod[data-on="true"] .rb-ord-prod-mark svg { opacity:1; transform:none; }

  /* option groups */
  .rb-ord-group { margin:0; padding:34px 0 0; border:0; }
  .rb-ord-legend { padding:0; font-family:${DISPLAY}; font-size:clamp(19px,2vw,23px); color:${IVORY}; }
  .rb-ord-help { font-size:13.5px; color:${DIM}; margin:6px 0 0; line-height:1.5; }
  .rb-ord-tag { font-family:${BODY}; font-size:10.5px; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    color:${FAINT}; margin-left:10px; vertical-align:middle; }

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

  /* text + form fields */
  .rb-ord-field { display:block; margin-top:18px; }
  .rb-ord-label { display:block; font-size:13px; letter-spacing:.02em; color:${GOLD_LIGHT}; margin-bottom:7px; }
  .rb-ord-input, .rb-ord-select, .rb-ord-textarea {
    width:100%; box-sizing:border-box; font-family:${BODY}; font-size:16px; color:${IVORY};
    background:rgba(11,10,9,.5); border:1px solid ${HAIR}; border-radius:4px; padding:13px 14px;
    transition:border-color .2s ${EASE}, background .2s ${EASE}; color-scheme:dark; }
  .rb-ord-textarea { min-height:92px; resize:vertical; line-height:1.55; }
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
  .rb-ord-readout { font-family:${BODY}; font-size:16px; color:${IVORY}; padding:13px 0 0; line-height:1.4; }
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

  /* mobile running total, sticks under the page header, never at the bottom
     (a bottom-fixed bar would collide with the preview chrome) */
  .rb-ord-mobiletotal { display:none; }

  /* motion: each earns its place. line-in confirms a choice registered,
     total-bump signals the price changed, group-in covers the product swap. */
  @keyframes rb-ord-linein { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:none; } }
  .rb-ord-slipline { animation:rb-ord-linein .26s ${EASE} both; }
  @keyframes rb-ord-bump { 0% { transform:none; } 38% { transform:scale(1.07); } 100% { transform:none; } }
  .rb-ord-total-value[data-bump="true"] { animation:rb-ord-bump .34s ${EASE}; }
  @keyframes rb-ord-groupin { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  .rb-ord-groups[data-key] { animation:rb-ord-groupin .38s ${EASE} both; }

  /* sent state */
  .rb-ord-done { border:1px solid ${GOLD}; border-radius:6px; padding:clamp(26px,4vw,40px);
    background:rgba(200,168,119,.07); text-align:center; animation:rb-ord-groupin .4s ${EASE} both; }
  .rb-ord-done-title { font-family:${DISPLAY}; font-size:clamp(26px,3.4vw,38px); margin:0; ${''} }

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
  /* padded so the phone number clears the 44px tap target on a phone */
  .rb-ord-tel { display:inline-block; padding:13px 10px; color:${GOLD_LIGHT}; text-decoration:none;
    border-bottom:1px solid rgba(238,211,170,.32); }
  .rb-ord-tel:hover { color:${IVORY}; border-bottom-color:${GOLD}; }
  .rb-ord-tel:focus-visible { outline:2px solid ${GOLD}; outline-offset:2px; border-radius:3px; }

  @media (max-width:900px) {
    .rb-ord-grid { grid-template-columns:1fr; gap:0; }
    /* the slip moves below the choices; a slim sticky bar carries the total instead */
    .rb-ord-slipwrap { order:2; margin-top:clamp(28px,4vh,40px); }
    .rb-ord-slip { position:static; }
    .rb-ord-formwrap { order:1; }
    .rb-ord-mobiletotal { display:flex; position:sticky; top:0; z-index:6; align-items:baseline; gap:10px;
      margin:0 calc(clamp(20px,4.5vw,72px) * -1); padding:11px clamp(20px,4.5vw,72px);
      background:rgba(11,10,9,.94); backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
      border-bottom:1px solid ${HAIR}; }
    .rb-ord-mobiletotal-label { font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:${FAINT}; }
    .rb-ord-mobiletotal-value { margin-left:auto; font-family:${DISPLAY}; font-size:19px; color:${GOLD};
      font-variant-numeric:tabular-nums; }
    .rb-ord-prods > * { max-width:100%; flex-basis:100%; }
    /* Cards go full width here, so a square photo would be ~390px tall each
       and push the actual choices three screens down. A letterbox keeps the
       product visible without burying the form. */
    .rb-ord-prod-pic { aspect-ratio:16 / 9; }
    /* the sticky bar already draws a divider, so the step right under it must
       not draw a second one. Adjacent-sibling, not :first-of-type, because the
       bar is itself the first div sibling. */
    .rb-ord-mobiletotal + .rb-ord-step { border-top:0; padding-top:0; margin-top:clamp(24px,3.5vh,34px); }
    .rb-ord-who { grid-template-columns:1fr; }
  }
  @media (max-width:520px) {
    .rb-ord-two { grid-template-columns:1fr; gap:0; }
    .rb-ord-choice-price { margin-left:0; padding-left:0; width:100%; }
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

const pad2 = (n: number) => String(n).padStart(2, '0')

/** Local-date ISO string. Never toISOString(), which is UTC and can shift the day. */
function isoPlusDays(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
}

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

const Check = () => (
  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" aria-hidden="true">
    <path d="M1 3.4L3.3 5.7L8 1" stroke="#131313" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

interface SlipLine {
  key: string
  name: string
  sub?: string
  price: number | null
}

export default function OrderSection({
  lang,
  /** On its own route the section carries the page's h1 and needs no top rule. */
  standalone = false,
  /** Lets the homepage teaser deep-link straight into a product. */
  initialProductId,
}: {
  lang: Lang
  standalone?: boolean
  initialProductId?: string
}) {
  const t = ORDER_T[lang]
  const { LINKS, ORDER_PRODUCTS, OCCASIONS, PICKUP_LOCATIONS } = useSiteContent()

  const [productId, setProductId] = useState(
    () => (initialProductId && ORDER_PRODUCTS.some((p) => p.id === initialProductId) ? initialProductId : ORDER_PRODUCTS[0].id),
  )
  const product: OrderProduct = useMemo(
    () => ORDER_PRODUCTS.find((p) => p.id === productId) ?? ORDER_PRODUCTS[0],
    [productId, ORDER_PRODUCTS],
  )

  /** A private order and a company order need different fields, not a different form. */
  const [who, setWho] = useState<'person' | 'company'>('person')
  const [qty, setQty] = useState(1)
  const [picked, setPicked] = useState<Record<string, string[]>>({})
  const [inscription, setInscription] = useState('')
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    location: PICKUP_LOCATIONS[0].id,
    notes: '',
    // company only
    company: '',
    kennitala: '',
    contact: '',
    invoiceEmail: '',
    occasion: OCCASIONS[0].id,
    guests: '',
    handover: 'pickup' as 'pickup' | 'delivery',
    address: '',
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [triedSubmit, setTriedSubmit] = useState(false)
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  /** True when the relay refused or the network failed — the customer must be
   *  told, and given the phone number, rather than left thinking it sent. */
  const [sendError, setSendError] = useState(false)

  const earliest = useMemo(() => isoPlusDays(product.leadDays), [product.leadDays])

  // Switching product invalidates every previous choice, so start that product clean.
  useEffect(() => {
    setPicked({})
    setInscription('')
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

  const toggle = (group: OrderGroup, choiceId: string) => {
    setPicked((prev) => {
      const cur = prev[group.id] ?? []
      if (group.kind === 'single') return { ...prev, [group.id]: [choiceId] }
      if (cur.includes(choiceId)) return { ...prev, [group.id]: cur.filter((c) => c !== choiceId) }
      if (group.max && cur.length >= group.max) return prev
      return { ...prev, [group.id]: [...cur, choiceId] }
    })
    setTouched((prev) => ({ ...prev, [`g_${group.id}`]: true }))
  }

  const { lines, total } = useMemo(() => {
    const out: SlipLine[] = [{ key: 'base', name: product.name[lang], sub: t.slipBase, price: product.basePrice }]
    let sum = product.basePrice
    for (const group of product.groups) {
      for (const id of picked[group.id] ?? []) {
        const choice = group.choices.find((c) => c.id === id)
        if (!choice) continue
        sum += choice.priceDelta
        out.push({
          key: `${group.id}_${choice.id}`,
          name: choice.label[lang],
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
  }, [product, picked, inscription, lang, qty, t])

  // Bump the total when it changes, so the price movement is felt, not just read.
  const [bump, setBump] = useState(false)
  const prevTotal = useRef(total)
  useEffect(() => {
    if (prevTotal.current === total) return
    prevTotal.current = total
    setBump(true)
    const id = window.setTimeout(() => setBump(false), 360)
    return () => window.clearTimeout(id)
  }, [total])

  const errors = useMemo(() => {
    const e: Record<string, string> = {}
    for (const group of product.groups) {
      if (!group.required) continue
      if ((picked[group.id] ?? []).length === 0) {
        e[`g_${group.id}`] = group.kind === 'single' ? t.errRequiredGroup : t.errRequiredMulti
      }
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
    return e
  }, [product, picked, customer, earliest, lang, t, who])

  const showErr = (key: string) => (touched[key] || triedSubmit ? errors[key] : undefined)

  const formRef = useRef<HTMLFormElement>(null)

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    setTriedSubmit(true)
    if (Object.keys(errors).length > 0) {
      // Send focus to the first thing that needs fixing rather than leaving the
      // customer to hunt for it.
      const first = formRef.current?.querySelector<HTMLElement>('[data-invalid="true"]')
      first?.scrollIntoView({ block: 'center', behavior: 'smooth' })
      first?.focus({ preventScroll: true })
      return
    }
    setStatus('sending')
    setSendError(false)

    const L = ORDER_T.is // the bakery reads its own orders in Icelandic
    const loc = PICKUP_LOCATIONS.find((l) => l.id === customer.location)?.label.is ?? customer.location
    const occ = OCCASIONS.find((o) => o.id === customer.occasion)?.label.is ?? customer.occasion

    /* The order is SNAPSHOTTED here, not looked up when the email is read.
       Prices and names are written into the message as they were on screen at
       the moment of ordering, so a later price change in the CMS can never
       retroactively alter what a customer was quoted. See reynir-cms-plan.md. */
    const payload: Record<string, string> = {
      _subject: `Pöntunarbeiðni: ${product.name.is}${qty > 1 ? ` (${qty} stk.)` : ''} — ${who === 'company' ? customer.company : customer.name}`,
      _template: 'table',
      _captcha: 'false',
      _honey: '', // honeypot: bots fill it, people never see it
      'Hver pantar': who === 'company' ? 'Fyrirtæki eða viðburður' : 'Einstaklingur',
      Vara: product.name.is,
      Fjöldi: String(qty),
    }
    product.groups.forEach((g) => {
      const chosen = (picked[g.id] ?? [])
        .map((cid) => {
          const c = g.choices.find((x) => x.id === cid)
          if (!c) return null
          return c.priceDelta > 0 ? `${c.label.is} (+${isk(c.priceDelta)})` : `${c.label.is} (innifalið)`
        })
        .filter(Boolean)
      if (chosen.length) payload[g.label.is] = chosen.join(', ')
    })
    if (product.inscription && inscription.trim()) payload['Áletrun'] = inscription.trim()
    payload['Áætlað verð'] = isk(total)

    if (who === 'company') {
      payload['Fyrirtæki'] = customer.company
      payload['Kennitala'] = customer.kennitala
      payload['Tengiliður'] = customer.contact
      if (customer.invoiceEmail.trim()) payload['Netfang fyrir reikning'] = customer.invoiceEmail.trim()
      payload['Tilefni'] = occ
      if (customer.guests.trim()) payload['Fjöldi gesta'] = customer.guests.trim()
      payload['Afhending'] = customer.handover === 'delivery' ? 'Sent' : 'Sótt'
      if (customer.handover === 'delivery') payload['Afhendingarstaður'] = customer.address
    } else {
      payload['Nafn'] = customer.name
    }
    payload['Sími'] = customer.phone
    if (customer.email.trim()) payload['Netfang'] = customer.email.trim()
    payload['Afhendingardagur'] = customer.date
    if (customer.handover !== 'delivery') payload['Sótt í'] = loc
    if (customer.notes.trim()) payload['Athugasemdir'] = customer.notes.trim()
    payload['Sent af vefnum'] = new Date().toLocaleString('is-IS')
    if (PLACEHOLDER_DATA) {
      payload['ATH'] = 'Vöruskrá vefsins er enn sýnishorn — verð og valmöguleikar eru ekki endanleg.'
    }

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${ORDER_FORM_TO}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(String(res.status))
      setStatus('done')
    } catch {
      // Never swallow this: a bakery order that silently vanishes is worse than
      // one that never started. Fall back to the phone number.
      setSendError(true)
      setStatus('idle')
    }
    void L
  }

  const reset = () => {
    setPicked({})
    setInscription('')
    setQty(1)
    setCustomer({
      name: '', phone: '', email: '', date: '', location: PICKUP_LOCATIONS[0].id, notes: '',
      company: '', kennitala: '', contact: '', invoiceEmail: '',
      occasion: OCCASIONS[0].id, guests: '', handover: 'pickup', address: '',
    })
    setTouched({})
    setTriedSubmit(false)
    setStatus('idle')
  }

  const slip = (
    <div className="rb-ord-slip">
      <div className="rb-ord-slip-title">{t.slipTitle}</div>
      <div className="rb-ord-slip-rule" aria-hidden="true" />
      <div>
        {lines.map((line) => (
          <div className="rb-ord-slipline" key={line.key}>
            <span className="rb-ord-slipline-name">
              {line.name}
              {line.sub && <span className="rb-ord-slipline-sub">{line.sub}</span>}
            </span>
            <span className="rb-ord-slipline-dots" aria-hidden="true" />
            <span className="rb-ord-slipline-price" data-free={line.price === null}>
              {line.price === null ? t.included : isk(line.price)}
            </span>
          </div>
        ))}
      </div>
      <div className="rb-ord-total">
        <span className="rb-ord-total-label">{t.slipTotal}</span>
        <span className="rb-ord-total-value" data-bump={bump} aria-live="polite">{isk(total)}</span>
      </div>
      <p className="rb-ord-slip-note">{t.slipNote}</p>
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
      <style>{ORDER_CSS}</style>
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
            {PLACEHOLDER_DATA && (
              <p style={{ fontSize: 13, color: DIM, margin: '14px auto 0', maxWidth: '46ch', fontStyle: 'italic' }}>{t.doneDemo}</p>
            )}
            <div style={{ marginTop: 22, fontSize: 15, color: GOLD_LIGHT, fontVariantNumeric: 'tabular-nums' }}>
              {t.slipTotal}: {isk(total)}
            </div>
            <button type="button" className="rb-ord-submit" style={{ width: 'auto', marginTop: 24 }} onClick={reset}>
              {t.doneAgain}
            </button>
          </div>
        ) : (
          <form ref={formRef} className="rb-ord-grid" style={{ marginTop: 'clamp(24px,3.5vh,36px)' }} onSubmit={onSubmit} noValidate>
            <div className="rb-ord-formwrap">
              {/* running total, mobile only */}
              <div className="rb-ord-mobiletotal">
                <span className="rb-ord-mobiletotal-label">{t.slipTotal}</span>
                <span className="rb-ord-mobiletotal-value" data-bump={bump} aria-live="polite">{isk(total)}</span>
              </div>

              {/* 1 — who is ordering (drives which details are asked for later) */}
              <div className="rb-ord-step" style={{ marginTop: 22 }}>
                <div className="rb-ord-steplabel">{t.stepWho}</div>
                <div className="rb-ord-who" role="radiogroup" aria-label={t.stepWho}>
                  {([
                    { id: 'person' as const, name: t.whoPerson, hint: t.whoPersonHint },
                    { id: 'company' as const, name: t.whoCompany, hint: t.whoCompanyHint },
                  ]).map((o) => (
                    <label key={o.id} className="rb-ord-wholane" data-on={who === o.id}>
                      <input
                        type="radio"
                        name="rb-ord-who"
                        checked={who === o.id}
                        onChange={() => setWho(o.id)}
                      />
                      <span className="rb-ord-wholane-name">{o.name}</span>
                      <span className="rb-ord-wholane-hint">{o.hint}</span>
                    </label>
                  ))}
                </div>
                {who === 'company' && <p className="rb-ord-help" style={{ marginTop: 12 }}>{t.bigOrderNote}</p>}
              </div>

              {/* 2 — product */}
              <div className="rb-ord-step">
                <div className="rb-ord-steplabel">{t.stepProduct}</div>
                <div className="rb-ord-prods" role="radiogroup" aria-label={t.stepProduct}>
                  {ORDER_PRODUCTS.map((p) => (
                    <label key={p.id} className="rb-ord-prod" data-on={p.id === productId}>
                      <input
                        type="radio"
                        name="rb-ord-product"
                        value={p.id}
                        checked={p.id === productId}
                        onChange={() => setProductId(p.id)}
                      />
                      <span className="rb-ord-prod-mark" aria-hidden="true"><Check /></span>
                      {p.image && (
                        <span className="rb-ord-prod-pic">
                          <img src={p.image} alt="" loading="lazy" decoding="async" width={1400} height={1400} />
                        </span>
                      )}
                      <span className="rb-ord-prod-name">{p.name[lang]}</span>
                      <span className="rb-ord-prod-from">{lang === 'is' ? 'frá' : 'from'} {isk(p.basePrice)}</span>
                    </label>
                  ))}
                </div>
                <p className="rb-ord-help" style={{ marginTop: 12 }}>{product.blurb[lang]}</p>
              </div>

              {/* 3 — options */}
              <div className="rb-ord-step">
                <div className="rb-ord-steplabel">{t.stepOptions}</div>
                <div className="rb-ord-groups" data-key={product.id} key={product.id}>
                  {product.groups.map((group) => {
                    const cur = picked[group.id] ?? []
                    const atMax = !!group.max && cur.length >= group.max
                    const err = showErr(`g_${group.id}`)
                    return (
                      <fieldset className="rb-ord-group" key={group.id}>
                        <legend className="rb-ord-legend">
                          {group.label[lang]}
                          <span className="rb-ord-tag">{group.required ? t.required : t.optional}</span>
                        </legend>
                        {(group.help || group.max) && (
                          <p className="rb-ord-help">
                            {group.help ? group.help[lang] : t.chooseUpTo(group.max as number)}
                          </p>
                        )}
                        <div className="rb-ord-choices">
                          {group.choices.map((choice) => {
                            const on = cur.includes(choice.id)
                            const off = !on && atMax
                            return (
                              <label
                                key={choice.id}
                                className="rb-ord-choice"
                                data-on={on}
                                data-off={off}
                              >
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
                                <span className="rb-ord-choice-price" data-free={choice.priceDelta === 0}>
                                  {choice.priceDelta === 0 ? t.included : `+ ${isk(choice.priceDelta)}`}
                                </span>
                              </label>
                            )
                          })}
                        </div>
                        {err && <p className="rb-ord-err" id={`err_g_${group.id}`} role="alert">{err}</p>}
                      </fieldset>
                    )
                  })}

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
                        placeholder={product.inscription.placeholder[lang]}
                        value={inscription}
                        onChange={(e) => setInscription(e.target.value)}
                      />
                      <p className="rb-ord-hint">{t.charsLeft(product.inscription.maxLength - inscription.length)}</p>
                    </div>
                  )}

                  <div className="rb-ord-field">
                    <span className="rb-ord-label" id="rb-ord-qty-label">{t.fieldQty}</span>
                    <div className="rb-ord-qty" role="group" aria-labelledby="rb-ord-qty-label">
                      <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label="−">−</button>
                      <span className="rb-ord-qty-val" aria-live="polite">{qty}</span>
                      <button type="button" onClick={() => setQty((q) => Math.min(99, q + 1))} disabled={qty >= 99} aria-label="+">+</button>
                    </div>
                    <p className="rb-ord-hint">{t.fieldQtyHint}</p>
                  </div>
                </div>
              </div>

              {/* 4 — customer */}
              <div className="rb-ord-step">
                <div className="rb-ord-steplabel">{t.stepDetails}</div>

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

                    <div className="rb-ord-two">
                      <div className="rb-ord-field">
                        <label className="rb-ord-label" htmlFor="rb-ord-occasion">{t.fieldOccasion}</label>
                        <select
                          id="rb-ord-occasion"
                          className="rb-ord-select"
                          value={customer.occasion}
                          onChange={(e) => setCustomer({ ...customer, occasion: e.target.value })}
                        >
                          {OCCASIONS.map((o) => (
                            <option key={o.id} value={o.id} style={{ background: INK }}>{o.label[lang]}</option>
                          ))}
                        </select>
                      </div>

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

                <div className="rb-ord-two">
                  <div className="rb-ord-field">
                    <label className="rb-ord-label" htmlFor="rb-ord-date">{t.fieldDate}</label>
                    <input
                      id="rb-ord-date"
                      className="rb-ord-input"
                      type="date"
                      min={earliest}
                      value={customer.date}
                      data-invalid={showErr('c_date') ? 'true' : undefined}
                      aria-invalid={!!showErr('c_date')}
                      aria-describedby={showErr('c_date') ? 'err_c_date' : 'hint_c_date'}
                      onChange={(e) => setCustomer({ ...customer, date: e.target.value })}
                      onBlur={() => setTouched({ ...touched, c_date: true })}
                    />
                    {showErr('c_date')
                      ? <p className="rb-ord-err" id="err_c_date" role="alert">{showErr('c_date')}</p>
                      : <p className="rb-ord-hint" id="hint_c_date">{t.fieldDateHelp(product.leadDays)}</p>}
                  </div>

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
                  {status === 'sending' ? `${t.submitting}...` : t.submit}
                </button>
                {triedSubmit && Object.keys(errors).length > 0 && (
                  <p className="rb-ord-errsummary" role="alert">{t.errSummary}</p>
                )}
                {sendError && (
                  <p className="rb-ord-errsummary" role="alert">
                    {lang === 'is'
                      ? 'Ekki tókst að senda pöntunina. Vinsamlegast hringdu í '
                      : 'We could not send that order. Please call us on '}
                    <a href={`tel:${LINKS.phone}`} className="rb-ord-tel">{LINKS.phoneLabel}</a>
                    {lang === 'is' ? ' og við klárum hana með þér.' : ' and we will take it down for you.'}
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
      </div>
    </section>
  )
}
