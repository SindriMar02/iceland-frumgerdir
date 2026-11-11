export const ALLERGEN_CSS=`
.hb-ofn .hb-quiz {
  align-items: start;
  gap: clamp(1rem, 2vw, 2rem);
}
.hb-ofn .hb-flipar {
  display: block;
}
.hb-ofn .hb-formP {
  min-width: 0;
}
.hb-ofn h2 {
  margin: 0;
}
.hb-allergenChoices {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.5rem;
  margin: 1.25rem 0 0.5rem;
}
.hb-allergenChoices button {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  min-height: 48px;
  padding: 0.65rem 0.7rem;
  border: 1px solid #172d4d70;
  border-radius: 8px;
  background: transparent;
  color: #172d4d;
  font: inherit;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
}
.hb-allergenChoices svg {
  flex: none;
}
.hb-allergenChoices button > span:last-child {
  margin-left: auto;
}
.hb-allergenChoices button[aria-pressed="true"] {
  background: #172d4d;
  color: #fff;
  border-color: #172d4d;
}
.hb-allergenClear {
  min-height: 44px;
  padding: 0.5rem 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 4px;
  cursor: pointer;
  text-align: left;
}
.hb-allergenNote,
.hb-allergenDisclaimer {
  font-size: 1rem;
  line-height: 1.5;
  margin: 1rem 0;
  max-width: 65ch;
}
.hb-allergenDisclaimer {
  padding: 1rem;
  border: 1px solid currentColor;
  border-radius: 8px;
  font-weight: 500;
}
.hb-allergenAnswer {
  min-width: 0;
  color: #172d4d;
}
.hb-allergenCount {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1rem;
}
.hb-allergenGroup {
  border: 1px solid #172d4d45;
  border-radius: 10px;
  padding: 1rem;
  background: #ffffff60;
  margin-bottom: 1.25rem;
}
.hb-allergenGroup h3 {
  font-family: var(--f-disp);
  font-size: clamp(1.2rem, 1.7vw, 1.6rem);
  line-height: 1.25;
  margin: 0;
  overflow-wrap: anywhere;
}
.hb-allergenGroup h3 > span {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #dbe8d6;
  color: #1d442b;
  font-family: inherit;
  font-size: 1.1rem;
}
.hb-allergenGroup.warning h3 > span {
  background: #f6dbc1;
  color: #653500;
}
.hb-allergenGroup > p {
  margin: 0.65rem 0;
}
.hb-allergenResults,
.hb-allergenMobile ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
.hb-allergenCard {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  width: 100%;
  min-width: 0;
  padding: 0.5rem;
  border: 1px solid #172d4d25;
  border-radius: 8px;
  background: #fff9;
  color: #172d4d;
  text-align: left;
  font: inherit;
  cursor: pointer;
}
.hb-allergenPack {
  display: grid;
  place-items: center;
  border-radius: 6px;
  flex: none;
  width: 72px;
  height: 84px;
}
.hb-allergenPack img {
  object-fit: contain;
  width: 64px;
  height: 76px;
}
.hb-allergenName {
  display: grid;
  gap: 0.4rem;
  min-width: 0;
}
.hb-allergenName strong {
  font-size: 1rem;
  line-height: 1.3;
  overflow-wrap: anywhere;
}
.hb-allergenContains {
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.4;
}
.hb-allergenBadges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  line-height: 1.4;
}
.hb-allergenBadges > span {
  display: inline-block;
  border: 1px solid currentColor;
  border-radius: 4px;
  padding: 2px 5px;
  font-size: 0.75rem;
  font-weight: 500;
}
.hb-allergenBadges > span.selected {
  font-weight: 700;
  background: #172d4d;
  color: white;
  border-color: #172d4d;
}
.hb-allergenFlow {
  animation: hb-allergenIn 0.22s ease-out;
}
@keyframes hb-allergenIn {
  from {
    opacity: 0.25;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
.hb-allergenBlock {
  padding: 1rem;
  border: 2px solid var(--c-ink);
  border-radius: 8px;
  margin: 1.25rem 0;
  line-height: 1.6;
}
.hb-allergenBlock > strong {
  font-size: 1.15rem;
  display: block;
}
.hb-allergenBlock mark {
  background: #f2dfa3;
  color: #172d4d;
  font-weight: 700;
  padding: 0 0.12em;
}
.hb-allergenBlock .hb-allergenDisclaimer {
  border: 0;
  padding: 0;
  margin-bottom: 0;
}
.hb-allergenFilter {
  display: grid;
  gap: 0.5rem;
  margin: 1rem 0;
  font-weight: 700;
}
.hb-allergenFilter select {
  min-height: 48px;
  padding: 0.6rem;
  font: inherit;
  font-size: 16px;
  background: var(--c-bg);
  color: var(--c-ink);
  border: 1px solid currentColor;
  border-radius: 6px;
  width: 100%;
}
.hb-pop:has(.hb-allergenMatrix) {
  width: min(1100px, 100vw);
}
.hb-allergenMatrix {
  overflow: auto;
  max-height: 65dvh;
  isolation: isolate;
  border: 1px solid var(--c-lina);
  margin: 1rem 0;
}
.hb-allergenMatrix table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 0.85rem;
}
.hb-allergenMatrix th,
.hb-allergenMatrix td {
  padding: 0.65rem 0.5rem;
  border-bottom: 1px solid var(--c-lina);
  text-align: center;
}
.hb-allergenMatrix thead th {
  position: sticky;
  top: 0;
  z-index: 3;
  background: var(--c-bg);
  font-weight: 700;
}
.hb-allergenMatrix th:first-child {
  position: sticky;
  left: 0;
  z-index: 2;
  background: var(--c-bg);
  min-width: 180px;
  text-align: left;
}
.hb-allergenMatrix thead th:first-child {
  z-index: 4;
}
.hb-allergenMatrix .hb-allergenLine {
  background: var(--c-el);
  font-weight: 700;
}
.hb-allergenMatrix button,
.hb-allergenMobile button {
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  text-align: left;
  min-height: 44px;
  width: 100%;
  cursor: pointer;
}
.hb-allergenMatrix td {
  font-size: 1.1rem;
}
.hb-allergenMobile {
  display: none;
}
@media (max-width: 600px) {
  .hb-allergenMatrix {
    display: none;
  }
  .hb-allergenMobile {
    display: block;
  }
  .hb-allergenMobile section {
    margin: 1.5rem 0;
  }
  .hb-allergenMobile li {
    border-bottom: 1px solid var(--c-lina);
  }
  .hb-allergenMobile button {
    display: grid;
    gap: 0.5rem;
    padding: 0.85rem 0;
  }
  .hb-allergenGroup {
    padding: 0.75rem;
  }
  .hb-allergenCard {
    gap: 0.6rem;
    padding: 0.4rem;
  }
  .hb-allergenChoices {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (prefers-reduced-motion: reduce) {
  .hb-allergenFlow {
    animation: none;
  }
}
`
