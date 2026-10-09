/* COPY of 04-platform/vaktin-receptionist/widget/sndr-chat.js (with the answerer hook, 2026-09-29).
   Edit the source there and re-copy; never edit this file. */
/**
 * <sndr-chat>, the guest assistant, as it is injected into a client's site.
 *
 * One file, no dependencies, no build step. Drop the script on the page and add
 * the element; that is the whole installation, which is the point. A client's
 * site is not going to grow a bundler because they bought a chat widget.
 *
 * ── SHADOW DOM, AND WHY IT IS NOT A CONTRADICTION ────────────────────────
 * The widget renders inside a shadow root so a client's own CSS can never
 * accidentally restyle it and so ours can never leak out and break their site.
 * That would normally also mean it cannot inherit their design, which is the
 * one thing it must do: a widget that looks like SNDR instead of like the
 * client reads as bolted on, and that is the exact thing we sell against.
 *
 * CSS custom properties pierce the shadow boundary, so the theme comes in as
 * variables set on the host element and everything inside is drawn from them:
 *
 *   sndr-chat {
 *     --chat-accent: #7a5c3a;      the client's own accent
 *     --chat-bg:     #fffdf8;      panel ground
 *     --chat-ink:    #1b1815;      primary text
 *     --chat-muted:  #6f6558;      secondary text
 *     --chat-line:   #e6dfd3;      hairlines
 *     --chat-radius: 14px;
 *     --chat-font:   'Their Font', system-ui, sans-serif;
 *   }
 *
 * ── WHAT THE UI IS FOR, PATTERN BY PATTERN ───────────────────────────────
 * Each of these is doing a job, not decorating:
 *
 *  · THE TOOL CHIP above an answer ("athugaði laust", "fletti upp verði") is
 *    the single most important element here. It is how a guest sees that the
 *    assistant read the real calendar or the real price list instead of
 *    producing a plausible sentence, and it is the visible half of the promise
 *    that it never invents. Never render it unless a tool actually ran.
 *  · THE CARD. Availability and prices come back as a structured block, not as
 *    a paragraph of numbers a guest has to parse and might misread.
 *  · THE CHIPS. A guest who does not know what to ask asks nothing. They are
 *    generated per client from that client's own FAQ.
 *  · THE REFUSAL is designed, not treated as an error state. It is the thing
 *    being sold, so it has to look composed and it always carries the phone
 *    number. See `refusal` below.
 *  · IT SAYS WHAT IT IS in the first message and never pretends to be a person.
 *
 * ── WHAT IT WILL NOT DO ──────────────────────────────────────────────────
 * It does not open by itself. A widget that ambushes a reader is the cheapest
 * possible signal and it is the reason people hate these things. It opens when
 * somebody taps it, and that is all.
 */

const CSS = `
:host {
  --_accent: var(--chat-accent, #141414);
  --_bg:     var(--chat-bg, #ffffff);
  --_ink:    var(--chat-ink, #111111);
  --_muted:  var(--chat-muted, #767676);
  --_line:   var(--chat-line, #ebebeb);
  --_sunk:   var(--chat-sunk, #f5f5f5);
  --_radius: var(--chat-radius, 16px);
  --_font:   var(--chat-font, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, system-ui, sans-serif);
  --_on-accent: var(--chat-on-accent, #ffffff);
  --_ease: cubic-bezier(.23, 1, .32, 1);

  position: fixed;
  right: max(18px, env(safe-area-inset-right));
  bottom: max(18px, env(safe-area-inset-bottom));
  z-index: 2147483000;
  font-family: var(--_font);
  color: var(--_ink);
  -webkit-font-smoothing: antialiased;
  letter-spacing: -.008em;
  /* inheritable properties cross the shadow boundary, so a client site with a
     global line-height would otherwise reflow the card. Pin our own. */
  line-height: 1.5;
}
* { box-sizing: border-box; }
button, a { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
button { font: inherit; color: inherit; cursor: pointer; }
:where(button, a):focus-visible {
  outline: 2px solid var(--_accent); outline-offset: 2px;
}

/* ── THE ORB ──────────────────────────────────────────────────────────────
   The single piece of iconography, replacing both the speech-bubble icon and
   the initial-letter avatar puck. It is derived entirely from the client's
   accent (the accent spun toward a cool and a warm neighbour), so every
   install gets its own orb without a second theme token. It is STILL at rest
   and spins only while the assistant is actually working, so its motion
   carries meaning instead of being decoration. */
.orb {
  position: relative; width: 20px; height: 20px; flex: none;
  border-radius: 50%; overflow: hidden; background: var(--_accent);
  /* clip-path as well as overflow, and it is not belt and braces: WebKit does
     NOT clip a FILTERED descendant to a rounded ancestor, so on iOS the blurred
     gradient below escaped and the orb rendered as a rounded square. Chrome
     clips it, which is why this only ever showed up on a real phone.
     clip-path clips filtered content on both. */
  clip-path: circle(50%);
}
.orb::before {
  content: ""; position: absolute; inset: -35%;
  background: conic-gradient(from 210deg,
    var(--_accent),
    color-mix(in srgb, var(--_accent) 52%, #3f7dff),
    color-mix(in srgb, var(--_accent) 58%, #8fe0ff),
    color-mix(in srgb, var(--_accent) 52%, #ff6aa8),
    var(--_accent));
  filter: blur(2px) saturate(1.7);
}
.orb::after {
  content: ""; position: absolute; inset: 0; border-radius: 50%;
  background:
    radial-gradient(90% 90% at 30% 24%, rgba(255,255,255,.65), rgba(255,255,255,0) 42%),
    radial-gradient(120% 120% at 72% 82%, rgba(0,0,0,.28), rgba(0,0,0,0) 55%);
}
@keyframes orbspin { to { transform: rotate(1turn) } }

/* ── EMBEDDED MODE ───────────────────────────────────────────────────────
   Normally the widget floats over a client's site. Embedded, it lives inside a
   box on the page instead: the demo stage on our own site, and the owner test
   console, where a bubble floating over a settings screen would be wrong.

   The host fills its container and pins its contents to the bottom right of
   it, so opening the card does not reflow the page around it, and the card
   never grows past the box it was given. The container must be positioned.  */
:host([embedded]) {
  position: absolute; inset: 12px;
  right: 12px; bottom: 12px; z-index: 2;
  display: flex; flex-direction: column;
  justify-content: flex-end; align-items: flex-end;
  pointer-events: none; /* whatever the stage shows behind stays clickable */
}
:host([embedded]) .launch, :host([embedded]) .panel { pointer-events: auto; }
:host([embedded]) .panel { width: min(100%, 396px); max-height: 100%; }
/* EMBEDDED SHEET: <sndr-chat embedded sheet> is the phone mockup on our own
   site, showing the widget the way a guest on a phone gets it, as the whole
   screen. Same rules as the mobile sheet below, minus the viewport: the box
   the host was given IS the phone. */
:host([embedded][sheet]) { inset: 0; }
:host([embedded][sheet]) .panel { width: 100%; height: 100%; max-height: none; border-radius: 0; border: 0; }
:host([embedded][sheet]) .log { flex: 1 1 auto; }
:host([embedded][sheet]) .kbd { display: none; } /* a phone has no Escape key */

/* ── the launcher: a quiet pill on the panel ground, not an accent blob ── */
.launch {
  display: flex; align-items: center; gap: 8px;
  background: var(--_bg); color: var(--_ink);
  border: 1px solid var(--_line); border-radius: 999px; padding: 10px 16px 10px 11px;
  box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 10px 28px -12px rgba(0,0,0,.22);
  font-size: 13.5px; font-weight: 500; letter-spacing: -.01em;
  transition: transform .16s var(--_ease), box-shadow .16s var(--_ease), border-color .16s;
}
/* the frosted material, where the browser can draw it */
@supports (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px)) {
  .launch {
    background: color-mix(in srgb, var(--_bg) 78%, transparent);
    -webkit-backdrop-filter: blur(16px) saturate(1.6);
    backdrop-filter: blur(16px) saturate(1.6);
  }
}
.launch:hover {
  transform: translateY(-1px); border-color: var(--_muted);
  box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 14px 34px -12px rgba(0,0,0,.28);
}
.launch:active { transform: scale(.97); }
:host([data-open]) .launch, :host([data-closing]) .launch { display: none; }

/* ── the panel: morphs out of the pill's corner ───────────────────────── */
.panel {
  display: none; flex-direction: column;
  width: 396px;
  /* Sizes to the conversation instead of standing at a fixed height. A fixed
     640px panel left a greeting stranded at one end of an empty box, which is
     the first thing a visitor sees. It opens small, grows as the conversation
     does, and stops at the cap, where the log starts scrolling instead. */
  max-height: min(640px, calc(100vh - 44px));
  background: var(--_bg); border: 1px solid var(--_line);
  border-radius: var(--_radius); overflow: hidden; position: relative;
  box-shadow:
    0 0 0 .5px rgba(0,0,0,.04),
    0 1px 2px rgba(0,0,0,.04),
    0 24px 70px -24px rgba(0,0,0,.3);
  /* it grows from where the pill sits, never from its own centre */
  transform-origin: 100% 100%;
}
@supports (backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px)) {
  .panel {
    background: color-mix(in srgb, var(--_bg) 88%, transparent);
    -webkit-backdrop-filter: blur(28px) saturate(1.7);
    backdrop-filter: blur(28px) saturate(1.7);
  }
}
:host([data-open]) .panel { display: flex; animation: morph .26s var(--_ease) both; }
:host([data-closing]) .panel { display: flex; animation: shrink .17s ease both; }
@keyframes morph { from { opacity: 0; transform: scale(.9) translateY(6px) } }
@keyframes shrink { to { opacity: 0; transform: scale(.94) translateY(4px) } }

.head {
  display: flex; align-items: center; gap: 9px;
  padding: 13px 14px 11px; flex: none;
}
/* the small kbd hint, ai-input style; pointless on a touch screen */
.kbd {
  flex: none; background: var(--_sunk); border-radius: 5px;
  padding: 3px 6px; font-size: 10px; font-weight: 500; color: var(--_muted); letter-spacing: .02em;
}
.who { flex: 1; min-width: 0; display: flex; align-items: baseline; gap: 7px; flex-wrap: wrap; }
.who b { font-size: 13.5px; font-weight: 600; letter-spacing: -.01em; }
/* It says what it is, permanently and quietly. The disclosure lives HERE so the
   first message can just be a person saying hello, instead of a paragraph of
   self-description nobody reads. */
.who span { font-size: 11px; color: var(--_muted); letter-spacing: .01em; }
.icon {
  width: 30px; height: 30px; flex: none; border: 0; background: none;
  border-radius: 7px; display: grid; place-items: center; color: var(--_muted);
}
.icon:hover { background: var(--_sunk); color: var(--_ink); }
.icon svg { width: 16px; height: 16px; }

.log {
  flex: 0 1 auto; min-height: 0; overflow-y: auto; overscroll-behavior: contain;
  padding: 6px 18px 18px; display: flex; flex-direction: column; gap: 20px;
  overflow-wrap: anywhere; /* a pasted URL must wrap, not push the log wide */
  /* The native bar is suppressed because we draw our own. On macOS and iOS it
     is an overlay that hides itself the moment you stop scrolling, so it can
     never answer "is there more below?" before you have already tried. */
  scrollbar-width: none;
}
.log::-webkit-scrollbar { width: 0; height: 0; }

/* ── the scroll rail ───────────────────────────────────────────────────
   Two jobs: say that the conversation runs past the panel, and say where in
   it you are. It appears only when the log actually overflows, so a short
   chat has no furniture on it at all.

   It hangs off the PANEL rather than off a wrapper around the log, and that
   is a scar: wrapping the log broke the panel's sizing outright. The log's
   height is what makes the panel grow with the conversation and stop at its
   cap, and a wrapper around it turned that into a circle that resolved to
   zero, so the panel opened with no conversation in it. JS gives the rail the
   log's own top and height instead, which leaves the flex tree untouched. */
.rail {
  position: absolute; right: 5px; width: 2px;
  border-radius: 2px; pointer-events: none;
  background: color-mix(in srgb, var(--_ink) 9%, transparent);
  opacity: 0; transition: opacity .2s ease;
}
.panel[data-scrollable] .rail { opacity: 1; }
.rail i {
  position: absolute; left: 0; right: 0; top: 0; border-radius: inherit;
  background: color-mix(in srgb, var(--_ink) 34%, transparent);
  /* height and translateY are written by JS on every scroll frame, so neither
     may be transitioned: the thumb has to sit exactly where the conversation
     is, not ease its way there a beat late. */
  transition: background .2s ease;
}
@media (hover: hover) and (pointer: fine) {
  .panel:hover .rail i { background: color-mix(in srgb, var(--_ink) 42%, transparent); }
}
/* A flex item shrinks by default, so a long answer or a card was being SQUASHED
   to fit the log instead of overflowing it. scrollHeight then equalled
   clientHeight, the container never became scrollable, and the bottom of the
   answer was clipped with no way to reach it. Every child keeps its own height. */
.log > * { flex: none; }

/* ── messages ──────────────────────────────────────────────────────────
   ONLY THE GUEST GETS A BUBBLE. The assistant answers as plain text on the
   panel ground, the way every serious assistant interface now does. Two
   opposing bubbles is the thing that makes a widget read as a 2010s support
   box, and it also wastes the width an answer needs. */
.msg { font-size: 14px; line-height: 1.55; }
.msg.me {
  align-self: flex-end; max-width: 84%;
  background: var(--_sunk); color: var(--_ink);
  padding: 9px 13px; border-radius: 15px 15px 4px 15px;
}
.msg.bot { align-self: stretch; max-width: 100%; color: var(--_ink); }
.msg.bot p { margin: 0; }
.msg.bot p + p { margin-top: 12px; }
.msg.bot b { font-weight: 600; }

/* THE TOOL LINE. Only ever rendered when a tool genuinely ran. A quiet line
   above the answer rather than a bordered chip: the disclosure has to be
   readable, not decorated. */
.tool {
  align-self: stretch; display: flex; align-items: center; gap: 7px;
  font-size: 12px; color: var(--_muted); letter-spacing: .01em;
  margin-bottom: -12px;
}
.tool svg { width: 12px; height: 12px; flex: none; opacity: .75; }

/* THE CARD. Numbers a guest would otherwise have to parse out of a sentence.
   Set quietly: no shouting uppercase header, no hairline under every row; the
   only divider sits above the total, where it means something. */
.card {
  align-self: stretch; width: 100%;
  border: 1px solid var(--_line); border-radius: 14px; background: var(--_bg);
}
.card-h {
  padding: 14px 16px 0; font-size: 12.5px; font-weight: 500; color: var(--_muted);
}
.card-b { padding: 6px 16px 6px; }
.row { display: flex; justify-content: space-between; gap: 14px; padding: 8px 0; font-size: 14.5px; }
.row .k { color: var(--_muted); }
.row .v { font-variant-numeric: tabular-nums; text-align: right; }
.row.total { font-weight: 600; border-top: 1px solid var(--_line); margin-top: 2px; padding-top: 10px; }
.row.total .k { color: var(--_ink); }
.card-cta {
  display: block; margin: 4px 10px 10px; text-align: center; text-decoration: none;
  background: var(--_accent); color: var(--_on-accent); border-radius: 10px;
  padding: 12px; font-size: 14px; font-weight: 500; border: 0;
  transition: transform .16s var(--_ease);
}
.card-cta:active { transform: scale(.98); }
.card-cta[disabled] { opacity: .5; cursor: default; }
/* what tapping confirm will do, said before the tap and never after it */
.card-note {
  padding: 0 16px 12px; margin: -2px 0 0;
  font-size: 12px; line-height: 1.5; color: var(--_muted);
}
.card.done { border-color: color-mix(in srgb, var(--_accent) 45%, var(--_line)); }

/* THE REFUSAL. Composed, never an error. It is the product. */
/* THE REFUSAL. Still the most important state, but it is an ANSWER, so it is
   set like one: plain text with the phone offered underneath. Boxing it made
   it read as an error, which is exactly what it is not. */
.refusal { align-self: stretch; width: 100%; }
.refusal p { margin: 0; font-size: 14px; line-height: 1.55; color: var(--_ink); }
.refusal .call {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 13px;
  text-decoration: none; color: var(--_ink); font-weight: 500; font-size: 13.5px;
  border: 1px solid var(--_line); border-radius: 999px; padding: 8px 15px;
}
.refusal .call:hover { background: var(--_sunk); border-color: var(--_muted); }
.refusal .call svg { width: 14px; height: 14px; }

/* thinking: the orb itself does the working, no dot theatre */
.think { align-self: flex-start; display: flex; padding: 2px 0; }
.think .orb { width: 18px; height: 18px; }
.think .orb::before { animation: orbspin 1.1s linear infinite; }

/* ── the chips and the composer ───────────────────────────────────────── */
.chips { display: flex; flex-wrap: wrap; gap: 7px; padding: 0 16px 13px; flex: none; }
.chips button {
  background: none; border: 1px solid var(--_line); border-radius: 999px;
  padding: 7px 12px; font-size: 12.5px; color: var(--_muted); line-height: 1.2;
  transition: color .15s, border-color .15s;
}
.chips button:hover { color: var(--_ink); border-color: var(--_muted); }
.chips button:active { transform: scale(.97); }

/* The field is its own bordered pill, and that pill IS the edge between the
   conversation and the place you type. There is deliberately no rule across
   the panel above it: one full width line plus a bordered control draws the
   same boundary twice, and the line was the heavier of the two. */
.composer {
  display: flex; gap: 8px; padding: 4px 12px 10px 14px; flex: none; align-items: center;
}
.composer input {
  flex: 1; min-width: 0; font-family: inherit;
  border: 1px solid var(--_line); border-radius: 999px;
  padding: 11px 16px; font-size: 14px; background: var(--_bg); color: var(--_ink);
  caret-color: var(--_accent);
  transition: border-color .15s, box-shadow .15s;
}
/* :focus, not :focus-visible. A text field should always show that it is
   focused, however the focus arrived, and open() focuses this one itself on
   desktop. The shared outline rule deliberately does not cover inputs, or it
   would sit as a second detached ring outside the pill's own border. */
.composer input:focus {
  outline: none;
  border-color: var(--_accent);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--_accent) 16%, transparent);
}
.composer input::placeholder { color: var(--_muted); }
.send {
  width: 34px; height: 34px; flex: none; border: 0; border-radius: 50%;
  background: var(--_accent); color: var(--_on-accent); display: grid; place-items: center;
  transition: opacity .15s, transform .16s var(--_ease);
}
@media (hover: hover) and (pointer: fine) {
  .send:not([disabled]):hover { transform: translateY(-1px); }
}
.send:active { transform: scale(.94); }
.send[disabled] { opacity: .3; cursor: default; }
.send svg { width: 15px; height: 15px; }

.foot {
  padding: 0 16px 10px; font-size: 10.5px; color: var(--_muted);
  text-align: center; flex: none; letter-spacing: .01em;
}
.foot a { color: inherit; }

/* ── mobile: a full sheet sliding up, and svh because the in-app browser
   chrome eats dvh on first paint ──────────────────────────────────────── */
@media (max-width: 560px) {
  /* Every rule that turns the widget into a full screen sheet is gated on NOT
     being embedded. Inside a stage on a page, taking over the viewport would
     swallow the page the stage is sitting on. */
  :host(:not([embedded])) { right: 0; bottom: 0; left: 0; }
  :host([data-open]:not([embedded])), :host([data-closing]:not([embedded])) { top: 0; }
  :host(:not([embedded])) .launch { position: fixed; right: max(16px, env(safe-area-inset-right)); bottom: max(16px, env(safe-area-inset-bottom)); }
  :host(:not([embedded])) .panel {
    width: 100%; height: 100svh; max-height: none; border-radius: 0; border: 0;
    padding-bottom: env(safe-area-inset-bottom);
    transform-origin: 50% 100%;
  }
  /* the sheet is full height, so the log absorbs the slack and the composer
     stays at the bottom of the screen, in thumb reach */
  :host(:not([embedded])) .log { flex: 1 1 auto; }
  /* phone-native sizes; anything under 16px in an input makes iOS zoom in */
  .msg, .refusal p { font-size: 15px; }
  .composer input { font-size: 16px; }
  :host([data-open]:not([embedded])) .panel { animation: sheet .3s cubic-bezier(.32,.72,0,1) both; }
  :host([data-closing]:not([embedded])) .panel { animation: sheetout .22s ease both; }
  .kbd { display: none; }
}
@keyframes sheet { from { transform: translateY(100%) } }
@keyframes sheetout { to { transform: translateY(100%) } }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .001ms !important; transition-duration: .001ms !important; }
  /* an infinite animation at .001ms restarts every frame; kill it outright */
  .think .orb::before { animation: none !important; }
}
`

const ORB = '<span class="orb" aria-hidden="true"></span>'

const ICON = {
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 6l6 6-6 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v2.1a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 3.2 2 2 0 0 1 4 1h2.1a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L7.5 8.7a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>',
}

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => (
  { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
))

class SndrChat extends HTMLElement {
  connectedCallback() {
    if (this._built) return
    this._built = true

    this.name = this.getAttribute('name') || ''
    this.phone = this.getAttribute('phone') || ''
    this.endpoint = this.getAttribute('endpoint') || '/receptionist/chat'
    // where a confirmed proposal is posted: the SAME endpoint the booking form
    // uses, so it meets the same validation and the same overbooking lock
    this.bookEndpoint = this.getAttribute('book-endpoint') || '/booking/request'
    this.lang = (this.getAttribute('lang') || 'is').toLowerCase()
    this.t = this.lang.startsWith('en') ? EN : IS

    let chips = []
    try { chips = JSON.parse(this.getAttribute('chips') || '[]') } catch { chips = [] }
    this.chips = chips

    const root = this.attachShadow({ mode: 'open' })
    root.innerHTML = `
      <style>${CSS}</style>
      <button class="launch" part="launcher" aria-expanded="false">
        ${ORB}<span>${esc(this.getAttribute('label') || this.t.launch)}</span>
      </button>
      <section class="panel" role="dialog" aria-modal="false" aria-label="${esc(this.name || this.t.launch)}">
        <header class="head">
          ${ORB}
          <div class="who">
            <b>${esc(this.name)}</b>
            <span>${esc(this.t.subtitle)}</span>
          </div>
          <span class="kbd" aria-hidden="true">esc</span>
          ${this.phone ? `<a class="icon" href="tel:${esc(this.phone.replace(/\s/g, ''))}" aria-label="${esc(this.t.callLabel)}">${ICON.phone}</a>` : ''}
          <button class="icon close" aria-label="${esc(this.t.close)}">${ICON.close}</button>
        </header>
        <div class="log" part="log" aria-live="polite"></div>
        <div class="rail" aria-hidden="true"><i></i></div>
        <div class="chips" part="chips"></div>
        <form class="composer">
          <input type="text" name="message" autocomplete="off" enterkeyhint="send" placeholder="${esc(this.t.placeholder)}" aria-label="${esc(this.t.placeholder)}">
          <button class="send" type="submit" aria-label="${esc(this.t.send)}">${ICON.send}</button>
        </form>
        <p class="foot">${esc(this.t.foot)}</p>
      </section>`

    this.$ = (s) => root.querySelector(s)
    this.log = this.$('.log')
    this.wireRail()

    this.$('.launch').addEventListener('click', () => this.open())
    this.$('.close').addEventListener('click', () => this.close())
    root.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.hasAttribute('data-open')) {
        e.stopPropagation()
        this.close()
      }
    })
    this.$('.composer').addEventListener('submit', (e) => {
      e.preventDefault()
      const i = this.$('.composer input')
      const v = i.value.trim()
      if (!v) return
      i.value = ''
      this.ask(v)
    })
    this.$('.chips').addEventListener('click', (e) => {
      const b = e.target.closest('button')
      if (!b) return
      // in scripted mode a chip is a label, and the question it asks may be
      // longer than the label, so it is resolved by index rather than by text
      if (this._demo) {
        const entry = this._demo[Number(b.dataset.i)]
        if (entry) return this.playEntry(entry)
      }
      this.ask(b.textContent)
    })

    /* The send button is live only when there is something to send. It doubles
       as the busy lock while a question is in flight. */
    this._busy = false
    this._syncSend = () => {
      this.$('.send').disabled = this._busy || !this.$('.composer input').value.trim()
    }
    this.$('.composer input').addEventListener('input', this._syncSend)
    this._syncSend()

    this.history = []
    this.greet()
  }

  /* ── state ──────────────────────────────────────────────────────────── */

  open() {
    this.removeAttribute('data-closing')
    this.setAttribute('data-open', '')
    this.$('.launch').setAttribute('aria-expanded', 'true')
    // desktop only: focusing an input on a phone throws up the keyboard over
    // the very greeting the guest has not read yet
    if (matchMedia('(min-width: 561px)').matches) this.$('.composer input').focus()
  }

  close() {
    if (!this.hasAttribute('data-open')) return
    this.removeAttribute('data-open')
    /* the exit is animated (fast, per the enter-slow/exit-snappy rule), so the
       panel stays displayed under [data-closing] until its animation ends */
    this.setAttribute('data-closing', '')
    const panel = this.$('.panel')
    let settled = false
    const done = () => {
      if (settled) return
      settled = true
      panel.removeEventListener('animationend', done)
      if (this.hasAttribute('data-open')) return // reopened mid-close
      this.removeAttribute('data-closing')
      this.$('.launch').setAttribute('aria-expanded', 'false')
      this.$('.launch').focus()
    }
    panel.addEventListener('animationend', done)
    setTimeout(done, 400) // failsafe: never leave the panel stuck closing
  }

  greet() {
    const g = this.getAttribute('greeting') || this.t.greeting(this.name)
    this.bot(g)
    this.renderChips()
  }

  renderChips() {
    const list = this._demo ? this._demo.map((e) => e.chip) : this.chips
    this.$('.chips').innerHTML = list
      .map((c, i) => `<button type="button" data-i="${i}">${esc(c)}</button>`)
      .join('')
  }

  /* ── the scroll rail ────────────────────────────────────────────────── */

  /**
   * Draws the thin indicator down the right edge of the log: it says the
   * conversation runs past the panel, and it says where in it you are.
   *
   * The native scrollbar cannot do this job. On macOS and iOS it is an overlay
   * that only exists while your finger is moving, so it answers "is there more
   * below?" strictly after you have already guessed and scrolled.
   *
   * Three things move the geometry, and all three are watched rather than
   * hooked into the call sites: scrolling, the log being resized (the panel
   * grows with the conversation until it hits its cap), and the conversation
   * itself changing. The MutationObserver is what makes this hold for every
   * path at once, including the ones that do not go through add(): the
   * thinking orb removing itself, and restart() emptying the log outright.
   */
  wireRail() {
    const panel = this.$('.panel')
    const rail = this.$('.rail')
    const thumb = this.$('.rail i')
    let queued = false

    const draw = () => {
      queued = false
      const { scrollTop, scrollHeight, clientHeight, offsetTop, offsetHeight } = this.log
      const over = scrollHeight - clientHeight
      // 4px, not 0: sub-pixel layout rounding leaves a hairline of overflow on
      // a log that is not actually scrollable, and a rail that appears on a
      // three-line conversation is worse than no rail at all.
      if (over <= 4) return panel.removeAttribute('data-scrollable')
      panel.setAttribute('data-scrollable', '')

      // the rail spans the log, inset a little at both ends so it does not run
      // into the header rule above it or the composer below
      const track = Math.max(0, offsetHeight - 14)
      rail.style.top = `${offsetTop + 6}px`
      rail.style.height = `${track}px`

      // A thumb proportional to a very long conversation shrinks to a dot that
      // reads as dirt on the screen, so it stops at 22px and slides instead.
      const h = Math.max(22, Math.round(track * (clientHeight / scrollHeight)))
      const y = Math.round((scrollTop / over) * (track - h))
      thumb.style.height = `${h}px`
      thumb.style.transform = `translateY(${y}px)`
    }

    this._drawRail = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(draw)
    }

    this.log.addEventListener('scroll', this._drawRail, { passive: true })
    this._railRO = new ResizeObserver(this._drawRail)
    this._railRO.observe(this.log)
    this._railMO = new MutationObserver(this._drawRail)
    this._railMO.observe(this.log, { childList: true, subtree: true, characterData: true })
  }

  /* ── rendering ──────────────────────────────────────────────────────── */

  add(html) {
    this.log.insertAdjacentHTML('beforeend', html)
    this.log.scrollTop = this.log.scrollHeight
    return this.log.lastElementChild
  }

  me(text) { return this.add(`<div class="msg me">${esc(text)}</div>`) }

  /** Paragraphs split on a blank line. **bold** is the only markup honoured. */
  bot(text) {
    const html = String(text).split(/\n{2,}/).map((p) =>
      `<p>${esc(p).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')}</p>`
    ).join('')
    return this.add(`<div class="msg bot">${html}</div>`)
  }

  /**
   * The disclosure chip. Call this ONLY when a tool actually ran: it is the
   * visible half of the promise that the assistant does not invent, and a
   * decorative one would be a lie told in the most trusted spot on the screen.
   */
  tool(label) {
    return this.add(`<div class="tool">${ICON.check}<span>${esc(label)}</span></div>`)
  }

  card({ title, rows = [], cta }, booking) {
    const body = rows.map((r) =>
      `<div class="row${r.total ? ' total' : ''}"><span class="k">${esc(r.k)}</span><span class="v">${esc(r.v)}</span></div>`
    ).join('')

    /* THE CONFIRM BUTTON, AND WHY IT IS A BUTTON AND NOT A LINK.
       The assistant has not booked anything: it prepared this, and the guest
       agreeing is the act that writes. So the card states what the tap will do
       before it is tapped, and the label never implies it already happened. */
    const action = booking
      ? `<button class="card-cta" type="button" data-confirm>${esc(
          booking.mode === 'INSTANT' ? this.t.confirmInstant : this.t.confirmRequest,
        )}</button>
         <p class="card-note">${esc(
           booking.mode === 'INSTANT' ? this.t.confirmNoteInstant : this.t.confirmNoteRequest,
         )}</p>`
      : cta
        ? `<a class="card-cta" href="${esc(cta.href || '#')}">${esc(cta.label)}</a>`
        : ''

    const el = this.add(
      `<div class="card">
        ${title ? `<div class="card-h">${esc(title)}</div>` : ''}
        <div class="card-b">${body}</div>
        ${action}
      </div>`
    )
    if (booking) {
      el.querySelector('[data-confirm]').addEventListener(
        'click',
        () => this.confirm(el, booking),
        { once: true },
      )
    }
    return el
  }

  /**
   * The guest's tap, and the only thing in this widget that writes.
   *
   * It posts the proposal the server built to the same endpoint the booking
   * form posts to, so it meets the same validation and the same Durable Object
   * that stops two guests taking one room. A 409 here is not a bug: it is that
   * gate doing its job while the guest was reading.
   */
  async confirm(cardEl, booking) {
    const btn = cardEl.querySelector('[data-confirm]')
    btn.disabled = true
    btn.textContent = this.t.confirming

    /* A scripted proposal has no endpoint behind it. It still plays the whole
       step, because the confirm IS the thing worth showing, but it must never
       post: a demo that writes into somebody's calendar would be a real
       booking made by a page labelled as a sample. */
    if (booking.demo) {
      setTimeout(() => {
        cardEl.classList.add('done')
        btn.remove()
        // the note said what the tap WOULD do, so it goes with the button. The
        // assistant says what happened, once, rather than the card echoing it
        cardEl.querySelector('.card-note')?.remove()
        this.bot(booking.mode === 'INSTANT' ? this.t.bookedInstant : this.t.bookedRequest)
        this.renderChips()
      }, 620)
      return
    }

    try {
      const res = await fetch(this.bookEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking.request),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok || data.ok === false) {
        btn.remove()
        cardEl.querySelector('.card-note')?.remove()
        // the room went while they were reading, or a field did not survive.
        // refusal() carries the phone, which is the only useful next step here
        this.refusal(res.status === 409 ? this.t.bookingTaken : this.t.bookingFailed)
        return
      }

      cardEl.classList.add('done')
      btn.remove()
      cardEl.querySelector('.card-note')?.remove()
      const instant = data.status === 'CONFIRMED' || booking.mode === 'INSTANT'
      this.bot(instant ? this.t.bookedInstant : this.t.bookedRequest)
    } catch {
      btn.disabled = false
      btn.textContent = booking.mode === 'INSTANT' ? this.t.confirmInstant : this.t.confirmRequest
      this.bot(this.t.offline)
    }
  }

  /**
   * What it says when it does not know, and it is the most important thing on
   * this screen. Designed as a composed answer with a way forward, never as an
   * error, because "it tells you when it does not know" is what is being sold.
   */
  refusal(text) {
    return this.add(
      `<div class="refusal">
        <p>${esc(text || this.t.refusal)}</p>
        ${this.phone ? `<a class="call" href="tel:${esc(this.phone.replace(/\s/g, ''))}">${ICON.phone}${esc(this.phone)}</a>` : ''}
      </div>`
    )
  }

  thinking(on) {
    if (on) return this.add(`<div class="think">${ORB}</div>`)
    const d = this.log.querySelector('.think')
    if (d) d.remove()
  }

  /* ── asking ─────────────────────────────────────────────────────────── */

  async ask(text) {
    // scripted mode never reaches the network, so a typed question that is not
    // in the script is answered by saying exactly that
    if (this._demo) {
      this.me(text)
      this.$('.chips').innerHTML = ''
      return this.answer(this._demoFallback || [{ bot: this.t.demoFallback }])
    }
    this.me(text)
    this.$('.chips').innerHTML = ''
    this.history.push({ role: 'user', content: text })
    this.thinking(true)
    this._busy = true
    this._syncSend()

    /* LOCAL ANSWERER: a page that is its own fact set (a redesign preview, the
       owner test console) sets `el.answerer = (history) => response` and the
       question never leaves the browser. It returns the same shape as the
       server, so every rule above holds: `tool` only when a lookup really ran,
       `refused` renders the designed refusal with the phone. It may also hand
       back `chips` to offer next. Nothing here can invent beyond what the page
       wrote into the answerer, and nothing can run up a bill. */
    if (typeof this.answerer === 'function') {
      try {
        const data = await Promise.all([
          Promise.resolve(this.answerer(this.history.slice(-8))),
          new Promise((r) => setTimeout(r, 480)), // a beat, so the orb does its job
        ]).then(([d]) => d || {})
        this.thinking(false)
        if (data.tool) this.tool(data.tool)
        if (data.refused) this.refusal(data.reply)
        else {
          if (data.reply) this.bot(data.reply)
          if (data.card) this.card(data.card)
        }
        this.history.push({ role: 'assistant', content: data.reply || '' })
        if (Array.isArray(data.chips)) this.chips = data.chips
        this.renderChips()
        this.log.scrollTop = this.log.scrollHeight
      } catch {
        this.thinking(false)
        this.refusal(this.t.offline)
      } finally {
        this._busy = false
        this._syncSend()
      }
      return
    }

    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: this.history.slice(-8) }),
      })
      const data = await res.json().catch(() => ({}))
      this.thinking(false)

      if (!res.ok) return this.refusal(data.message || this.t.busy)

      // the server says whether a tool ran; the chip is never rendered on a guess
      if (data.tool) this.tool(data.tool)
      if (data.refused) return this.refusal(data.reply)
      if (data.reply) this.bot(data.reply)
      if (data.card) this.card(data.card, data.booking)
      this.history.push({ role: 'assistant', content: data.reply || '' })
    } catch {
      this.thinking(false)
      this.refusal(this.t.offline)
    } finally {
      this._busy = false
      this._syncSend()
    }
  }

  /**
   * Replay a scripted conversation without a server.
   *
   * This exists for two real jobs, not as a toy: the owner test console, where
   * an owner reviews answers before the widget goes live, and the scenario
   * screenshots on our own site, which are captured from THIS component so a
   * marketing image can never drift from what actually ships.
   */
  seed(steps) {
    this.log.innerHTML = ''
    this.$('.chips').innerHTML = ''
    this.play(steps)
  }

  /** Render one scripted conversation into the log, appending to whatever is
      already there. Shared by seed() and by scripted mode. */
  play(steps) {
    for (const s of steps) {
      if (s.me) this.me(s.me)
      if (s.tool) this.tool(s.tool)
      if (s.bot) this.bot(s.bot)
      if (s.card) this.card(s.card, s.booking)
      if (s.refusal) this.refusal(s.refusal)
      if (s.chips) { this.chips = s.chips; this.renderChips() }
    }
    this.log.scrollTop = this.log.scrollHeight
  }

  /**
   * SCRIPTED MODE, for the two places where there is no assistant behind the
   * widget: the demo on our own site, and the owner test console.
   *
   * This is NOT a live assistant with an empty fact set, which would either
   * answer about nothing or invent, and inventing on the page that sells "it
   * does not invent" would be fatal. Every word here was written and approved
   * in advance, and nothing in this path touches the network, so a visitor
   * cannot make it invent and cannot run up a bill. It is the same guarantee a
   * screenshot gives, except it cannot go stale, because it IS the component.
   *
   * `entries` are `{ key, chip, q, steps }`: the chip label, the question it
   * asks, and the answer it plays.
   */
  demo(entries, fallback) {
    this._demo = entries
    this._demoFallback = fallback
    this.renderChips()
  }

  playEntry(entry) {
    this.me(entry.q)
    this.$('.chips').innerHTML = ''
    this.answer(entry.steps)
  }

  /** Play a scenario by key, so the page around the widget can drive it too. */
  playKey(key) {
    const entry = (this._demo || []).find((e) => e.key === key)
    if (entry) { this.open(); this.playEntry(entry) }
  }

  /** Back to the opening state, which is a scenario in its own right: it is
      what a guest sees before they have asked anything. */
  restart() {
    clearTimeout(this._demoTimer)
    this.log.innerHTML = ''
    this.open()
    this.greet()
  }

  /** The scripted answer, after a beat of thinking so the orb does its job.
      The chips come back afterwards, because a visitor will want another. */
  answer(steps) {
    this.thinking(true)
    clearTimeout(this._demoTimer)
    this._demoTimer = setTimeout(() => {
      this.thinking(false)
      this.play(steps)
      this.renderChips()
      this.log.scrollTop = this.log.scrollHeight
    }, 620)
  }

  disconnectedCallback() {
    clearTimeout(this._demoTimer)
    this._railRO?.disconnect()
    this._railMO?.disconnect()
  }
}

/* ── VOICE ────────────────────────────────────────────────────────────
   It talks like somebody who works here, not like software describing its own
   architecture. The old greeting explained that it was "trained on our
   operations and connected to the calendar and price list", which no employee
   would ever say and which nobody reads.

   The disclosure did not get dropped, it MOVED: the header carries "sjálfvirk
   aðstoð" permanently and the footer says it plainly. That is honest on every
   screen instead of in one paragraph at the top that scrolls away. */
/* ── HOW IT TALKS ─────────────────────────────────────────────────────────
   It answers like somebody who works here, because that is the whole product.
   Three things are therefore banned from this block:

   1. LISTING ITS OWN CAPABILITIES. Nobody picks up the phone and says "I can
      help with rooms, prices and availability." They say "what can I do for
      you." The guest finds out what it can do by asking it something.
   2. MACHINE EXCUSES. "Rate limited", "no connection", "I am experiencing high
      load" are our problem, not the guest's. Every failure says the one useful
      thing instead: ring us, and apologise for it first.
   3. THE BUSINESS NAME IN A GREETING. Icelandic would need it in the dative
      ("hjá Gistihúsinu Fell", not "hjá Gistihúsið Fell") and a business name
      cannot be declined safely by code. The header already shows the name, so
      the greeting does not repeat it. `n` stays in the signature for the call
      site and is deliberately unused. */
const IS = {
  launch: 'Spurðu okkur',
  subtitle: 'sjálfvirk aðstoð',
  placeholder: 'Skrifaðu okkur',
  send: 'Senda',
  close: 'Loka',
  callLabel: 'Hringja',
  foot: 'Sjálfvirk aðstoð. Þú nærð alltaf í okkur í síma.',
  greeting: (n) => 'Halló! Hvað get ég gert fyrir þig?',
  refusal: 'Æ, þetta finn ég ekki hjá okkur og ég vil alls ekki segja þér neitt rangt. Það er best að hringja í okkur, við finnum þetta strax fyrir þig.',
  demoFallback: 'Þetta er sýnishorn af viðmótinu sjálfu og hér er enginn aðstoðarmaður tengdur. Veldu eina af spurningunum hér fyrir neðan, þá sérðu alvöru svar.',
  /* THE CONFIRM STEP. The assistant has not booked anything; the guest is
     about to. So the button says what it will do, never what has happened. */
  confirmRequest: 'Staðfesta bókunarbeiðni',
  confirmInstant: 'Staðfesta bókun',
  confirmNoteRequest: 'Beiðnin fer til okkar og við staðfestum hana. Þú borgar á staðnum.',
  confirmNoteInstant: 'Bókunin gildir strax þegar þú ýtir. Þú borgar á staðnum.',
  confirming: 'Augnablik…',
  bookedRequest: 'Takk, beiðnin er komin til okkar. Við staðfestum hana og heyrum í þér.',
  bookedInstant: 'Takk, bókunin er frágengin. Við sjáum þig þá.',
  bookingTaken: 'Æ, þetta fór á meðan þú last. Það er nýbúið að taka þetta pláss.',
  bookingFailed: 'Bókunin komst ekki í gegn hjá mér og ég vil ekki lofa þér plássi sem ég veit ekki hvort er til.',
  busy: 'Fyrirgefðu, ég er full lengi að þessu. Það er fljótlegast að hringja í okkur, við svörum strax.',
  offline: 'Fyrirgefðu, það er eitthvað í ólagi hjá mér núna. Hringdu í okkur, við svörum strax og hjálpum þér.',
}

const EN = {
  launch: 'Ask us',
  subtitle: 'automated help',
  placeholder: 'Write to us',
  send: 'Send',
  close: 'Close',
  callLabel: 'Call',
  foot: 'Automated help. You can always reach us by phone.',
  greeting: (n) => 'Hello! What can I do for you?',
  refusal: 'Sorry, I cannot find that one and I would hate to tell you something wrong. Best thing is to give us a ring, we will find it for you straight away.',
  demoFallback: 'This is a sample of the interface itself and there is no assistant connected here. Pick one of the questions below and you will see a real answer.',
  confirmRequest: 'Confirm booking request',
  confirmInstant: 'Confirm booking',
  confirmNoteRequest: 'The request comes to us and we confirm it. You pay on arrival.',
  confirmNoteInstant: 'Your booking is valid the moment you press it. You pay on arrival.',
  confirming: 'One moment…',
  bookedRequest: 'Thank you, we have your request. We will confirm it and get back to you.',
  bookedInstant: 'Thank you, your booking is confirmed. See you then.',
  bookingTaken: 'Sorry, that went while you were reading. Somebody has just taken that space.',
  bookingFailed: 'The booking did not go through at my end, and I will not promise you a space I cannot be sure of.',
  busy: 'Sorry, I am taking far too long with this. Quickest thing is to give us a ring, we answer straight away.',
  offline: 'Sorry, something is wrong at my end. Give us a ring and we will sort you out straight away.',
}

customElements.define('sndr-chat', SndrChat)
export { SndrChat }
