// Shared interaction tokens. Geometry overrides follow the original section styles.
export const MOTION = {
  fast: 150,
  ui: 220,
  panel: 320,
  reveal: 480,
  out: "cubic-bezier(.16,1,.3,1)",
  emphasis: "cubic-bezier(.22,.8,.24,1)",
} as const;

export const EXPERIENCE_CSS = `
.hb-root {
  --motion-fast: ${MOTION.fast}ms;
  --motion-ui: ${MOTION.ui}ms;
  --motion-panel: ${MOTION.panel}ms;
  --motion-reveal: ${MOTION.reveal}ms;
  --motion-out: ${MOTION.out};
  --motion-emphasis: ${MOTION.emphasis};
  --ease: var(--motion-out);
  --ease-popup: var(--motion-emphasis);
  --ease-cas: var(--motion-out);
}
.hb-root :is(button, a, summary) {
  touch-action: manipulation;
  transition:
    transform var(--motion-fast) var(--motion-out),
    scale var(--motion-fast) var(--motion-out),
    opacity var(--motion-ui) var(--motion-out);
  min-height: 44px;
}
.hb-root :is(button, a, summary):focus-visible {
  outline: 2px solid var(--c-rautt);
  outline-offset: 3px;
}
.hb-root :is(button, a, summary):active {
  scale: 0.98;
}
.hb-root :is(.hb-btn,.hb-hnappur):active {transform:none}
.hb-root :is(button, a):disabled {
  scale: 1;
}
:where(.hb-root) a {
  display: inline-flex;
  align-items: center;
}
.hb-root a:not(.hb-hnappur),
.hb-orderLink,
.hb-allergenClear {
  position: relative;
  text-decoration: none;
}
.hb-root a:not(.hb-hnappur)::before,
.hb-orderLink::before,
.hb-allergenClear::before {
  content: "";
  position: absolute;
  inset: auto 0 0.15em;
  height: 1px;
  background: currentColor;
  pointer-events: none;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--motion-ui) var(--motion-out);
}
.hb-root a:not(.hb-hnappur):focus-visible::before,
.hb-orderLink:focus-visible::before,
.hb-allergenClear:focus-visible::before {
  transform: scaleX(1);
}
.hb-root :is(input, select, textarea) {
  font-size: 16px;
  max-width: 100%;
  min-width: 0;
}
.hb-root :is(h1,h2,h3,h4,h5,h6) {letter-spacing:-.01em}
.hb-root p {
  max-width: 70ch;
  overflow-wrap: anywhere;
}
.hb-root :is(section[id], [id].hb-kafli) {
  scroll-margin-top: calc(var(--haus-h, 64px) + 1rem);
}
.hb-root :is(.hb-reit, .hb-kort, .hb-lina2, .hb-allergenCard) {
  isolation: isolate;
  position: relative;
}
.hb-root :is(.hb-reit, .hb-kort, .hb-lina2, .hb-allergenCard)::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: var(--c-ink);
  opacity: 0;
  transition: opacity var(--motion-ui) var(--motion-out);
  z-index: 0;
}
.hb-root :is(.hb-reit, .hb-kort, .hb-lina2, .hb-allergenCard) img {
  transition:
    transform var(--motion-panel) var(--motion-out),
    scale var(--motion-panel) var(--motion-out);
}
@media (hover: hover) and (pointer: fine) {
  .hb-root :is(button, a, summary):hover {
    opacity: 0.88;
  }
  .hb-root a:not(.hb-hnappur):hover::before,
  .hb-orderLink:hover::before,
  .hb-allergenClear:hover::before {
    transform: scaleX(1);
  }
  .hb-root :is(.hb-reit, .hb-kort, .hb-lina2, .hb-allergenCard):hover img {
    scale: 1.03;
  }
  .hb-root :is(.hb-reit, .hb-kort, .hb-lina2, .hb-allergenCard):hover::after {
    opacity: 0.045;
  }
  .hb-order :is(.hb-unit button, .hb-orderIcon, .hb-orderRail button):hover {
    opacity: 0.72;
  }
}
.hb-order,
.hb-pokiBak,
.hb-pop,
.hb-popB {
  transition:
    opacity var(--motion-panel) var(--motion-out),
    transform var(--motion-panel) var(--motion-emphasis),
    visibility 0s var(--motion-panel);
}
.hb-order.on,
.hb-pokiBak.on,
.hb-pop.opid,
.hb-popB.opid {
  transition-delay: 0s;
}
.hb-pop {
  opacity: 0;
}
.hb-pop.opid {
  opacity: 1;
}
.hb-pop .hb-mask > * {
  transition-duration: var(--motion-reveal);
  transition-delay: 0s;
}
.hb-fell {
  display: grid;
  grid-template-rows: 0fr;
  padding: 0;
  overflow: hidden;
  transition:
    grid-template-rows var(--motion-ui) var(--motion-out),
    opacity var(--motion-ui) var(--motion-out),
    transform var(--motion-ui) var(--motion-out),
    visibility 0s var(--motion-ui);
}
.hb-fell.opid {
  grid-template-rows: 1fr;
  transition-delay: 0s;
}
.hb-fellInner {
  min-height: 0;
  overflow: hidden;
  padding-inline: 0.45rem;
}
.hb-fellInner > :first-child {
  margin-top: 0.45rem;
}
.hb-fellInner > :last-child {
  margin-bottom: 0.45rem;
}
.hb-faqB {
  transition: grid-template-rows var(--motion-panel) var(--motion-out);
}
.hb-faqB p {
  transition: opacity var(--motion-fast) var(--motion-out);
}
.hb-allergenFlow {
  animation: hb-allergenIn var(--motion-ui) var(--motion-out);
}
.hb-allergenChoices button[aria-pressed="true"] svg {
  animation: hb-chipIn var(--motion-ui) var(--motion-emphasis);
}
@keyframes hb-chipIn {
  from {
    transform: scale(0.85);
  }
  to {
    transform: scale(1);
  }
}
.hb-allergenBadges > span {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}
.hb-allergenBadges svg {
  width: 14px;
  height: 14px;
  flex: none;
}
.hb-allergenPreview {
  border: 1px solid #172d4d30;
  border-radius: 12px;
  padding: clamp(0.8rem, 2vw, 1.5rem);
}
.hb-allergenPreview > p {
  font-family: inherit;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1rem;
}
.hb-allergenPreview ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem 1rem;
  list-style: none;
  margin: 0;
  padding: 0;
}
.hb-allergenPreview li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
  font-size: 0.85rem;
}
.hb-allergenPreview li svg {
  flex: none;
  width: 18px;
  height: 18px;
}
.hb-allergenPreview li strong {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}
.hb-orderMain {
  container-type: inline-size;
  animation: hb-stepIn var(--motion-ui) var(--motion-out);
}
.hb-orderMain.step-leaving {
  animation: hb-stepOut var(--motion-fast) var(--motion-out) forwards;
}
@keyframes hb-stepIn {
  from {
    opacity: 0;
    transform: translateX(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes hb-stepOut {
  to {
    opacity: 0;
    transform: translateX(-6px);
  }
}
.hb-orderGroup {
  scroll-margin-top: 3.8rem;
}
.hb-orderGroup h3 {
  position: sticky;
  top: -1.5rem;
  z-index: 3;
  background: var(--c-bg);
  padding: 0.7rem 0;
  border-bottom: 1px solid var(--c-lina);
}
.hb-orderRow {
  grid-template-columns: 72px minmax(0, 1fr);
  padding: 1rem 0.5rem;
  border-radius: 10px;
}
.hb-orderRow.has-order {
  background: color-mix(in srgb, var(--row-tint, var(--c-el)) 28%, var(--c-bg));
}
.hb-orderRow > .hb-amountUnit {
  grid-column: 2;
  width: 100%;
  max-width: 35rem;
}
.hb-amountUnit {
  grid-template-columns: 8.5rem minmax(0, 1fr);
  gap: 0.5rem;
}
.hb-unit {
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--unit-count), minmax(0, 1fr));
  gap: 0;
  isolation: isolate;
  min-width: 0;
}
.hb-unitPill {
  position: absolute;
  inset: 3px auto 3px 3px;
  width: calc((100% - 6px) / var(--unit-count));
  background: var(--c-ink);
  border-radius: 5px;
  z-index: -1;
  transform: translateX(calc(var(--unit-index) * 100%));
  transition: transform var(--motion-ui) var(--motion-emphasis);
}
.hb-order .hb-unit button {
  min-width: 0;
  padding: 0.3rem 0.4rem;
  font-size: 0.85rem;
  line-height: 1.15;
  overflow-wrap: anywhere;
  color: var(--c-ink);
  background: transparent;
}
.hb-order .hb-unit button[aria-checked="true"] {
  color: var(--c-bg);
  background: transparent;
}
.hb-unitDetail {
  grid-column: 1 / -1;
  font-size: 0.75rem;
  line-height: 1.4;
  color: var(--c-ink-med);
}
.hb-other,
.hb-orderNote {
  display: grid;
  gap: 0.4rem;
  grid-column: 1 / -1;
  font-size: 0.85rem;
  font-weight: 500;
  min-width: 0;
}
.hb-other input,
.hb-orderNote textarea {
  width: 100%;
  padding: 0.7rem;
  min-height: 44px;
  background: var(--c-form);
  border: 1px solid var(--c-lina);
  border-radius: 6px;
  font-size: 16px !important;
  font-weight: 400;
}
.hb-orderNote textarea {
  resize: vertical;
}
.hb-orderNotePreview {
  display: grid;
  gap: 0.3rem;
  white-space: pre-wrap;
  font-size: 0.9rem;
}
.hb-orderSummaryGroups > section:not(:has(li)) {
  display: none;
}
.hb-orderSummaryGroups h4 {
  font-size: 0.8rem;
  margin: 0.75rem 0 0.25rem;
  font-weight: 600;
  color: var(--c-ink-med);
}
.hb-orderLines .hb-summaryPresence {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  padding: 0;
  border: 0;
  gap: 0;
  opacity: 1;
  transition:
    grid-template-rows var(--motion-ui) var(--motion-out),
    opacity var(--motion-ui) var(--motion-out);
}
.hb-orderLines .hb-summaryPresence.exiting {
  grid-template-rows: 0fr;
  opacity: 0;
}
@starting-style {
  .hb-orderLines .hb-summaryPresence {
    grid-template-rows: 0fr;
    opacity: 0;
  }
}
.hb-summaryClip {
  min-height: 0;
  overflow: hidden;
}
.hb-summaryRow {
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 44px;
  align-items: start;
  gap: 0.65rem;
  padding: 0.85rem 0;
  border-top: 1px solid var(--c-lina);
}
.hb-summaryRow > img {
  width: 40px;
  height: 48px;
  object-fit: contain;
  border-radius: 5px;
}
.hb-summaryRow .hb-amountUnit {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: 1fr;
  width: 100%;
}
.hb-summaryRow .hb-magn {
  width: 100%;
}
.hb-summaryRow .hb-unit {
  width: 100%;
}
.hb-summaryRow small {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.hb-orderSlipBody {
  min-height: 0;
  overflow: auto;
}
.hb-orderSteps {
  position: relative;
  isolation: isolate;
}
.hb-orderSteps::before {
  content: "";
  position: absolute;
  left: 1rem;
  right: 1rem;
  top: 50%;
  height: 1px;
  background: var(--c-lina);
  z-index: -1;
}
.hb-orderSteps button {
  background: var(--c-bg);
  border-bottom: 0;
}
.hb-orderSteps button[aria-current="step"] > span {
  background: var(--c-ink);
  color: var(--c-bg);
}
.hb-orderFooter {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid var(--c-lina);
  padding: 0.35rem 1.25rem calc(0.35rem + env(safe-area-inset-bottom));
  flex: none;
  font-size: 0.8rem;
}
.hb-orderFooter > span {
  margin-right: auto;
  max-width: 40ch;
}
.hb-orderFooter .hb-hnappur {
  padding: 0.5rem 0.8rem;
  min-height: 44px;
}
.hb-orderPrevious {
  margin-bottom: 1rem !important;
}
.hb-orderPrevious li {
  gap: 1rem;
  border-bottom: 1px solid var(--c-lina);
  padding: 0.5rem 0;
}
.hb-orderPrevious li > span {
  min-width: 0;
}
.hb-orderPrevious strong {
  display: block;
  overflow-wrap: anywhere;
  font-size: 0.9rem;
}
.hb-orderPrevious small {
  display: block;
  font-size: 0.8rem;
}
.hb-orderPrevious button {
  flex: none;
  font-size: 0.85rem;
}
.hb-orderFilter,
.hb-dateChips button {
  border: 1px solid var(--c-lina);
  border-radius: 999px;
  background: var(--c-form);
  padding: 0.5rem 0.8rem;
  min-height: 44px;
  font: inherit;
}
.hb-orderFilter[aria-pressed="true"],
.hb-dateChips button[aria-pressed="true"] {
  background: var(--c-ink);
  color: var(--c-bg);
}
.hb-orderFilter {
  justify-self: start;
}
.hb-dateChips,
.hb-orderReceiptActions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.hb-dateChips button {
  font-size: 0.8rem;
}
.hb-orderReceiptSlip dd {
  white-space: pre-wrap;
}
.hb-orderReceiptSlip li > span {
  white-space: normal;
  overflow-wrap: anywhere;
}
.hb-orderHelpBack {
  opacity: 0;
  transition: opacity var(--motion-ui) var(--motion-out);
}
.hb-orderHelpBack.on {
  opacity: 1;
}
.hb-orderHelp {
  transform: translateY(8px) scale(0.98);
  transition: transform var(--motion-ui) var(--motion-emphasis);
}
.hb-orderHelpBack.on .hb-orderHelp {
  transform: none;
}
@starting-style {
  .hb-orderHelpBack.on {
    opacity: 0;
  }
  .hb-orderHelpBack.on .hb-orderHelp {
    transform: translateY(8px) scale(0.98);
  }
}
@container (max-width:500px) {
  .hb-orderRow > .hb-amountUnit {
    grid-column: 1 / -1;
    grid-template-columns: 1fr;
  }
  .hb-orderRow .hb-magn {
    max-width: 100%;
    width: 100%;
  }
  .hb-orderGroup h3 {
    font-size: 1.4rem;
  }
}
@media (max-width: 1180px) and (min-width: 761px) {
  .hb-orderLayout {
    grid-template-columns: 122px minmax(0, 1fr) 288px;
  }
  .hb-orderLayout.is-details {
    grid-template-columns: minmax(0, 1fr) 288px;
  }
  .hb-orderMain {
    padding: 1rem;
  }
  .hb-orderGroup h3 {
    top: -1rem;
  }
}
@media (max-width: 760px) {
  .hb-orderRow > .hb-amountUnit {
    max-width: none;
  }
  .hb-orderHead {
    gap: 0.25rem 0.5rem;
  }
  .hb-orderHead h2 {
    font-size: clamp(1.3rem, 5vw, 1.8rem);
  }
  .hb-orderSteps {
    gap: 0;
  }
  .hb-orderSteps button {
    font-size: 0.75rem;
  }
  .hb-orderGroup h3 {
    top: -1rem;
  }
  .hb-orderSlip {
    display: grid;
    grid-template-rows: 56px 0fr;
    height: auto;
    max-height: 66%;
    flex-shrink: 1;
    transition: grid-template-rows var(--motion-panel) var(--motion-out);
    padding-bottom: 0;
  }
  .hb-orderSlip.expanded {
    height: auto;
    grid-template-rows: 56px 1fr;
  }
  .hb-orderSlipBody {
    min-height: 0;
    overflow: hidden;
  }
  .hb-orderSlipInner {
    max-height: calc(var(--order-height, 100dvh) * 0.43);
    overflow: auto;
    visibility: hidden;
    transition: visibility 0s var(--motion-panel);
  }
  .expanded .hb-orderSlipInner {
    visibility: visible;
    transition-delay: 0s;
  }
  .hb-orderFooter {
    gap: 0.5rem;
    padding-inline: 1rem;
  }
  .hb-orderFooter > span {
    font-size: 0.7rem;
  }
  .hb-orderPrevious li {
    flex-wrap: wrap;
    gap: 0.15rem;
  }
}
@media (max-width: 359px) {
  .hb-allergenChoices,
  .hb-allergenPreview ul {
    grid-template-columns: 1fr;
  }
  .hb-orderMain,
  .hb-orderSlipInner {
    padding-inline: 0.75rem;
  }
  .hb-orderSteps button {
    font-size: 0.7rem;
    gap: 0.2rem;
  }
  .hb-orderSteps button > span {
    width: 22px;
    height: 22px;
  }
}
@media (max-height: 650px) {
  .hb-orderHead {
    padding-block: 0.4rem;
    gap: 0.2rem 0.6rem;
  }
  .hb-orderEyebrow {
    display: none;
  }
  .hb-orderHead h2 {
    font-size: 1.4rem;
  }
  .hb-orderHead .hb-orderSteps {
    order: 0;
    width: auto;
  }
  .hb-orderSteps button {
    font-size: 0.75rem;
  }
  .hb-orderSteps button > span {
    width: 22px;
    height: 22px;
  }
  .hb-orderRail {
    padding-block: 0;
  }
  .hb-orderFooter {
    padding-block: 0.2rem;
  }
  .hb-orderHelp {
    max-height: calc(100dvh - 1rem);
  }
}
/* Bound content while the section surfaces and footer remain full bleed. */
.hb-root {
  --content-max: 112rem;
}
.hb-root
  :is(
    .hb-heroT,
    .hb-rist,
    .hb-umI,
    .hb-formP,
    .hb-faq,
    .hb-tolur,
    .hb-fotRod,
    .hb-fotBot
  ) {
  min-width: 0;
}
.hb-root .hb-disp {
  letter-spacing: -0.01em;
}
.hb-root :is(.hb-setning, .hb-galT) {
  max-width: 70rem;
  width: min(100%, 70rem);
}
.hb-root .hb-setning {
  padding-inline: var(--gut);
}
.hb-root .hb-umC {
  width: 50%;
  min-width: 0;
}
.hb-root .hb-faq {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}
.hb-root .hb-panta {
  position: relative;
}
.hb-root .hb-pantaM {
  position: absolute;
  left: 100%;
  top: 0;
  width: var(--bw, 10rem);
  pointer-events: none;
  opacity: 0;
  transform: translateX(-8px);
  transition:
    transform var(--motion-ui) var(--motion-out),
    opacity var(--motion-ui) var(--motion-out);
}
@media (hover: hover) and (pointer: fine) {
  .hb-root .hb-panta:has(.hb-btn:hover, .hb-btn:focus-visible) .hb-pantaM {
    opacity: 1;
    transform: none;
  }
}
.hb-root .hb-panta:has(.hb-btn:focus-visible) .hb-pantaM {
  opacity: 1;
  transform: none;
}
.hb-root .hb-pop {
  width: min(50%, 56rem);
  max-width: 100%;
  height: 100dvh;
  max-height: 100dvh;
}
.hb-root .hb-pop:has(.hb-allergenMatrix) {
  width: min(1100px, 100%);
}
.hb-root .hb-popS {
  min-height: 0;
}
.hb-root .hb-popT {
  flex: none;
}
.hb-root .hb-fot {
  overflow-wrap: anywhere;
}
.hb-root .hb-reitir :is(input, textarea, select) {
  font-size: 16px;
  min-height: 48px;
}
@media (min-width: 1920px) {
  .hb-root {
    --gut: 2rem;
    --page-gut: max(2rem, calc((100vw - var(--content-max)) / 2));
    --col: 1.5rem;
  }
  .hb-root :is(.hb-kostir,.hb-saga,.hb-faq,.hb-wrap,.hb-form,.hb-yfirl,.hb-fot) {padding-inline:var(--page-gut)}
  .hb-root .hb-spjald:first-child {padding-left:var(--page-gut)}
  .hb-root .hb-spjald:nth-child(2) {padding-right:var(--page-gut)}
  .hb-root .hb-linurL {padding-inline:var(--page-gut)}
  .hb-root .hb-heroT {
    padding-inline: max(2rem, calc((100vw - var(--content-max)) / 2)) 2rem;
  }
  .hb-root .hb-rist {
    padding-inline: 2rem max(2rem, calc((100vw - var(--content-max)) / 2));
    gap: 1rem;
  }
  .hb-root .hb-kort {
    width: 31%;
    height: auto;
    aspect-ratio: 1.02;
  }
  .hb-root .hb-kortin {
    justify-content: center;
  }
  .hb-root .hb-umC {
    width: 50%;
  }
  .hb-root .hb-umI {
    max-width: 56rem;
  }
  .hb-root .hb-umC:first-child .hb-umI {
    margin-left: auto;
  }
  .hb-root .hb-umM {
    width: 10rem;
  }
  .hb-root .hb-lina2 {
    width: 42rem;
    height: 25rem;
  }
  .hb-root .hb-linurP {
    gap: 3rem;
  }
}
@media (max-width: 1180px) and (min-width: 992px) {
  .hb-root .hb-navL {
    padding-inline: 0.6rem;
    font-size: 0.85rem;
  }
  .hb-root .hb-heroT h1 {
    font-size: clamp(2.25rem, 4.17vw, 3.5rem);
  }
}
@media (max-width: 991px) {
  .hb-root .hb-pop {
    width: 100%;
  }
  .hb-root .hb-umK {flex-direction:column}
  .hb-root .hb-umC {
    width: 100%;
  }
  .hb-root .hb-pantaM {
    display: none;
  }
}
@media (max-width: 767px) {
  .hb-root .hb-quiz,
  .hb-root .hb-faq {
    grid-template-columns: minmax(0, 1fr);
  }
  .hb-root .hb-faqK {
    position: relative;
    top: auto;
    height: auto;
    min-height: 24rem;
    max-height: none;
  }
  .hb-root .hb-umI {
    grid-template-columns: minmax(0, 1fr);
  }
  .hb-root .hb-umT,
  .hb-root .hb-umQ {
    grid-column: 1;
    grid-row: auto;
  }
  .hb-root .hb-umM {
    width: clamp(5rem, 20vw, 9rem);
  }
  .hb-root .hb-tolur {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .hb-root .hb-tala {
    min-height: 17rem;
  }
  .hb-root .hb-valRod {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 479px) {
  .hb-root .hb-faqT,
  .hb-root .hb-tolur {
    grid-template-columns: minmax(0, 1fr);
  }
  .hb-root .hb-kort {
    height: auto;
    min-height: 20rem;
    aspect-ratio: 1;
  }
  .hb-root .hb-kort h3 {
    font-size: clamp(1.4rem, 7.4vw, 2.1rem);
  }
  .hb-root .hb-galL li {
    width: clamp(7rem, 34vw, 10rem);
    height: clamp(9rem, 44vw, 13rem);
  }
  .hb-root .hb-heroT {
    padding-top: calc(var(--haus-h, 60px) + 2rem);
  }
}
@media (max-height: 650px) {
  .hb-root .hb-hero {
    height: auto;
    min-height: 100svh;
  }
  .hb-root .hb-heroT {
    padding-top: calc(var(--haus-h, 64px) + 2rem);
    padding-bottom: 2rem;
  }
  .hb-root .hb-rist {
    height: auto;
    min-height: 0;
    padding-top: calc(var(--haus-h, 64px) + 2rem);
    padding-bottom: 2rem;
  }
  .hb-root .hb-vorur {
    height: auto;
    min-height: 100svh;
  }
  .hb-root .hb-spjald {
    height: 100svh;
    min-height: 24rem;
  }
  .hb-root .hb-faqK {
    height: auto;
    min-height: 24rem;
    position: relative;
    top: auto;
  }
  .hb-root .hb-linurP {
    height: auto;
    min-height: 100svh;
  }
}
@media (max-height: 450px) and (max-width: 991px) {
  .hb-root .hb-hero {
    grid-template-columns: minmax(0, 1fr);
  }
  .hb-root .hb-rist {
    padding-top: 1rem;
  }
  .hb-root .hb-heroT h1 {
    font-size: clamp(2.25rem, 6vw, 3.5rem);
  }
  .hb-root .hb-valPan {
    max-height: calc(100dvh - var(--haus-h, 60px));
  }
  .hb-order .hb-orderSteps {
    order: 2;
    width: 100%;
  }
}

.hb-root :is(.hb-lit button,.hb-orderIcon,.hb-popX) {min-width:44px;min-height:44px}
.hb-root :is(.hb-haus .hb-pokiH,.hb-nav,.hb-navL) {min-height:clamp(44px,2.5vw,56px)}
.hb-root .hb-popX {width:clamp(44px,2.5vw,56px);height:clamp(44px,2.5vw,56px)}
.hb-root .hb-spjaldM {min-height:14rem}
.hb-root .hb-stika > * {min-width:0}
.hb-root .hb-stika b {overflow-wrap:anywhere}
@media (max-width:600px) {.hb-root .hb-takkar {flex-wrap:wrap}.hb-root .hb-takkar > * {min-width:0;white-space:normal;line-height:1.3}}
@media print {
  body:has(.hb-order.on .hb-orderReceiptSlip) > :not(:has(.hb-order.on)) {display:none!important}
  .hb-root:has(.hb-order.on .hb-orderReceiptSlip) > :not(.hb-order):not(style),
  .hb-order:has(.hb-orderReceiptSlip) .hb-orderHead,
  .hb-order:has(.hb-orderReceiptSlip) .hb-orderFooter,
  .hb-orderReceipt > :not(.hb-orderReceiptSlip) {display:none!important}

  body:has(.hb-order.on .hb-orderReceiptSlip) * {
    visibility: hidden !important;
    animation: none !important;
    transition: none !important;
  }
  body:has(.hb-order.on .hb-orderReceiptSlip),
  html:has(.hb-order.on .hb-orderReceiptSlip) {
    position: static !important;
    overflow: visible !important;
    height: auto !important;
  }
  .hb-root:has(.hb-orderReceiptSlip),
  .hb-order.on:has(.hb-orderReceiptSlip),
  .hb-order:has(.hb-orderReceiptSlip) .hb-orderLayout,
  .hb-order:has(.hb-orderReceiptSlip) .hb-orderMain,
  .hb-orderReceipt {
    display: block !important;
    position: static !important;
    height: auto !important;
    max-height: none !important;
    overflow: visible !important;
    transform: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  .hb-orderReceiptSlip,
  .hb-orderReceiptSlip * {
    visibility: visible !important;
  }
  .hb-orderReceiptSlip {
    position: static !important;
    width: 100% !important;
    margin: 0 !important;
    background: white !important;
    color: black !important;
    border: 0 !important;
    box-shadow: none !important;
  }
  .hb-orderReceiptSlip li,
  .hb-orderReceiptSlip dl > div {
    break-inside: avoid;
  }
}
@media (prefers-reduced-motion: reduce) {
  .hb-root *,
  .hb-root *::before,
  .hb-root *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
`;
