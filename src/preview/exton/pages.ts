import { COLLECTIONS, OTHER_RENTALS, MAIL, MAP_URL, PHONE, PILLARS, PRODUCTS, ROUTE_EN, ROUTE_IS, SITE_URL, T, brand, img, pick, type Collection, type Lang, } from './data'



export type PageId = 'home' | 'hljod' | 'svid' | 'tjold' | 'hljodfaeri' | 'about' | 'contact' | 'requests' | '404'
export const PAGE_IDS: PageId[] = ['home', 'hljod', 'svid', 'tjold', 'hljodfaeri', 'about', 'contact', 'requests', '404']

const SLUG: Record<PageId, { is: string; en: string }> = {
  home: { is: '', en: '' },
  hljod: { is: '/hljod', en: '/sound' },
  svid: { is: '/svid', en: '/stages' },
  tjold: { is: '/tjold', en: '/tents' },
  hljodfaeri: { is: '/hljodfaeri', en: '/instruments' },
  about: { is: '/um-okkur', en: '/about' },
  contact: { is: '/fa-tilbod', en: '/quote' },
  requests: { is: '/beidnir', en: '/requests' },
  '404': { is: '/404', en: '/404' },
}
const VIEW: Record<PageId, string> = { home: 'home', hljod: 'category', svid: 'category', tjold: 'category', hljodfaeri: 'category', about: 'about', contact: 'contact', requests: 'about', '404': '404' }

export const basePath = (lang: Lang) => (lang === 'is' ? ROUTE_IS : ROUTE_EN)
export const keyOf = (id: PageId, lang: Lang) => SLUG[id][lang] || '/'
export const hrefOf = (id: PageId, lang: Lang) => `${basePath(lang)}${SLUG[id][lang]}/`
export const idOfKey = (key: string, lang: Lang): PageId => PAGE_IDS.find((id) => keyOf(id, lang) === key) ?? '404'
export const routeList = (lang: Lang) => PAGE_IDS.map((id) => ({ key: keyOf(id, lang), slug: SLUG[id][lang], view: VIEW[id], category: COLLECTIONS.some((c) => c.key === id) ? id : '' }))

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const statCls = (...w: string[]) => (w.join(' ').split(/\s+/).some((x) => x.length >= 12) ? ' fact__stat--long' : '')
const pf = (o: Record<string, string>) => esc(JSON.stringify(o))


const WIDTHS: Record<string, [number, number]> = {
  "hero": [
    900,
    450
  ],
  "sound": [
    900,
    450
  ],
  "mixer": [
    683,
    341
  ],
  "mic": [
    1920,
    640
  ],
  "rcf1": [
    900,
    450
  ],
  "rcf2": [
    900,
    450
  ],
  "evox1": [
    900,
    450
  ],
  "evox2": [
    900,
    450
  ],
  "nexo": [
    900,
    450
  ],
  "meyer": [
    900,
    450
  ],
  "stage": [
    1000,
    500
  ],
  "stage8": [
    495,
    247
  ],
  "stage10": [
    495,
    247
  ],
  "deck": [
    720,
    360
  ],
  "party": [
    1920,
    640
  ],
  "tent6": [
    450,
    225
  ],
  "tent8": [
    450,
    225
  ],
  "top": [
    450,
    225
  ],
  "gala": [
    450,
    225
  ],
  "instruments": [
    1000,
    500
  ],
  "guitars": [
    687,
    343
  ],
  "drums": [
    1000,
    500
  ],
  "ampeg": [
    1030,
    515
  ],
  "keys": [
    700,
    350
  ],
  "branches": [
    1000,
    500
  ],
  "furniture": [
    1000,
    500
  ],
  "lights": [
    1920,
    640
  ]
}
const src = (f: string, sizes: string, extra = '') => {
  const w = WIDTHS[f] ?? [1920, 960]
  return `src="${img(f)}" srcset="${img(`${f}-s`)} ${w[1]}w, ${img(f)} ${w[0]}w" sizes="${sizes}"${extra}`
}
const arrow = (white = false) => `<img src="${brand(white ? 'arrow-white.svg' : 'arrow.svg')}" alt="" width="17" height="15">`


const credit = (t: Record<string, string>) =>
  `<p class="credit"><span class="credit__text">${esc(t.creditPre)}</span> <a class="sndr" href="https://sndrstudio.is" target="_blank" rel="noopener" aria-label="${esc(t.creditAria)}" data-logotype><span class="sndr__mark">SN<i>✦</i>DR</span><span class="sndr__studio">STUDIO</span></a></p>`

const dock = (t: Record<string, string>) => `<div class="dock">
            <a class="dock__picker" href="#selection" aria-haspopup="true" aria-expanded="false" data-picker-toggle>
              <span>${esc(t.forSale)}</span>
              <svg viewBox="0 0 13 13" aria-hidden="true"><rect width="4" height="4"/><rect x="9" width="4" height="4"/><rect y="9" width="4" height="4"/><rect x="9" y="9" width="4" height="4"/></svg>
            </a>
            <button class="dock__burger" type="button" aria-label="${esc(t.menuOpen)}" aria-expanded="false" data-drawer-toggle>
              <svg viewBox="0 0 23 12" aria-hidden="true"><rect width="23" height="3"/><rect class="bar-short" y="9" width="10" height="3"/></svg>
            </button>
          </div>`

const masthead = (lang: Lang, t: Record<string, string>, logo: 'white' | 'ink', current?: 'about' | 'contact', withDock = true) => `<header class="masthead">
          <a class="brand" href="${hrefOf('home', lang)}" aria-label="${esc(t.brand)}"><img src="${brand(`exton-logo-${logo === 'ink' ? 'grey' : 'white'}.png`)}" alt="${esc(t.logoAlt)}" width="138" height="60"></a>
          <a class="navlink navlink--start" href="${hrefOf('about', lang)}"${current === 'about' ? ' aria-current="page"' : ''}>${esc(t.about)}</a>
          <a class="navlink navlink--end" href="${hrefOf('contact', lang)}"${current === 'contact' ? ' aria-current="page"' : ''}>${esc(t.contact)}</a>
          <button class="menu-top" type="button" aria-label="${esc(t.menuOpen)}" aria-expanded="false" data-drawer-toggle data-intro-fade><span>${esc(t.menuLabel)}</span><svg viewBox="0 0 23 12" aria-hidden="true"><rect width="23" height="3"/><rect class="bar-short" y="9" width="10" height="3"/></svg></button>
          ${withDock ? dock(t) : ''}
        </header>`

const ticker = (word: string, cls = '', attrs = '') => `<div class="ticker${cls}"${attrs} aria-hidden="true">
              <div class="ticker__mask"><div class="ticker__track"><div class="ticker__group"><span class="ticker__word">${esc(word)}</span></div></div></div>
            </div>`


const TILE: Record<string, string> = { hljod: 'sea', svid: 'green', tjold: 'urban', hljodfaeri: 'rare' }

const NAME_EM: Record<string, { is: number; en: number }> = { hljod: { is: 5.2, en: 3.4 }, svid: { is: 2.8, en: 3.8 }, tjold: { is: 6.2, en: 3.3 }, hljodfaeri: { is: 5.6, en: 7.1 } }

const picker = (lang: Lang, t: Record<string, string>) => `<nav class="picker" tabindex="-1" inert aria-label="${esc(t.pickerAria)}" aria-hidden="true">
      <ul class="picker__grid">
        <li class="picker__slot" data-slot="home" hidden>
          <a class="tile tile--light" href="${hrefOf('home', lang)}" data-route="${hrefOf('home', lang)}">
            <span class="tile__panel">
              <img class="tile__mark" src="${brand('exton-logo-grey.png')}" alt="">
              <span class="tile__name">${esc(t.homeTile)}</span>
              <span class="tile__blurb">${esc(t.homeTileBlurb)}</span>
            </span>
            <span class="tile__cover"><img data-src="${img('hero-s')}" alt=""></span>
          </a>
        </li>
${COLLECTIONS.map((c) => `        <li class="picker__slot" data-slot="${c.key}">
          <a class="tile" href="${hrefOf(c.key, lang)}" data-route="${hrefOf(c.key, lang)}" style="--tile: var(--c-${TILE[c.key]}); --nw: ${NAME_EM[c.key]?.[lang] ?? 8}">
            <span class="tile__panel">
              <img class="tile__mark" src="${brand('exton-logo-white.png')}" alt="">
              <span class="tile__name">${esc(pick(c.name, lang))}</span>
              <span class="tile__blurb">${esc(pick(c.blurb[0], lang))} <br>${esc(pick(c.blurb[1], lang))}</span>
            </span>
            <span class="tile__cover"><img data-src="${img(`${c.cover}-s`)}" alt=""></span>
          </a>
        </li>`).join('\n')}
      </ul>
    </nav>`

const rollIcon = (kind: 'tel' | 'globe') => {
  const path =
    kind === 'tel'
      ? '<path d="M4.6 1.2a2 2 0 0 1 2.2.9l1.1 2a2 2 0 0 1-.4 2.3l-.9.9a11 11 0 0 0 4.6 4.6l.9-.9a2 2 0 0 1 2.3-.4l2 1.1a2 2 0 0 1 .9 2.2l-.4 1.5a2.6 2.6 0 0 1-2.6 1.9C7.3 17.3 2.7 12.7 2.7 6.7A2.6 2.6 0 0 1 4.6 4.1Z"/>'
      : '<path d="M10 1a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm-.1 1.7c-1 .9-1.9 2.6-2.2 5.4h4.6c-.3-2.8-1.3-4.5-2.4-5.4ZM6.2 8.1H2.8a7.3 7.3 0 0 0 0 3.8h3.4a16 16 0 0 1 0-3.8Zm1.5 3.8c.3 2.8 1.2 4.4 2.2 5.4 1.1-.9 2.1-2.6 2.4-5.4Zm6.1-3.8a16 16 0 0 1 0 3.8h3.4a7.3 7.3 0 0 0 0-3.8Z"/>'
  const svg = `<svg viewBox="0 0 20 20">${path}</svg>`
  return `<span class="roll-icon roll-icon--sq" aria-hidden="true"><span class="roll-icon__track">${svg}${svg}</span></span>`
}

const drawer = (lang: Lang, t: Record<string, string>) => {
  const other: Lang = lang === 'is' ? 'en' : 'is'
  const label: Partial<Record<PageId, string>> = { home: t.home, about: t.about, contact: t.contact, requests: t.requests }
  const link = (id: PageId, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${hrefOf(id, lang)}">${esc(label[id] ?? '')}</a>`
  return `<div class="drawer" aria-hidden="true">
    <div class="drawer__scrim"></div>
    <button class="drawer__close" type="button" aria-label="${esc(t.menuClose)}" hidden>
      <span class="drawer__close-label">${esc(t.menuCloseLabel)}</span>
      <svg viewBox="0 0 23 12" aria-hidden="true"><rect class="bar-long" width="23" height="3"/><rect class="bar-short" y="9" width="10" height="3"/></svg>
    </button>
    <div class="drawer__panel" tabindex="-1" inert role="dialog" aria-modal="true" aria-label="${esc(t.nav)}">
      <nav class="drawer__links" aria-label="${esc(t.navPrimary)}">
        ${link('home')}
        ${link('contact')}
        ${link('about')}
        ${link('requests', 'drawer__links--minor')}
      </nav>
      <div class="drawer__contact">
        <div class="drawer__row">
          <a href="${PHONE.href}">${rollIcon('tel')}${esc(PHONE.display)}</a>
          <a href="${basePath(other)}/" hreflang="${other}" lang="${other}">${rollIcon('globe')}${esc(t.langSwitch)}</a>
        </div>
        <div class="drawer__foot"><p>${esc(t.protoNote)}</p>${credit(t)}</div>
      </div>
    </div>
  </div>`
}

const loader = () => `<div class="loader" aria-hidden="true">
    <div class="loader__veil"></div>
    <div class="loader__frames">
${COLLECTIONS.map((c, i) => `      <div class="loader__frame"><img src="${img(`${c.cover}-s`)}" alt="" decoding="async"${i === 0 ? ' fetchpriority="high"' : ''}></div>`).join('\n')}
      <div class="loader__frame"><img src="${img('hero-s')}" alt="" decoding="async"></div>
    </div>
    <div class="loader__count">
      <div class="loader__window">
        <div class="loader__digits">
          ${[0, 1].map(() => `<span class="loader__col"><span class="loader__reel">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => `<span>${d}</span>`).join('')}</span></span>`).join('\n          ')}
        </div>
      </div>
    </div>
  </div>`

export function renderShell(id: PageId, lang: Lang): string {
  const t = T[lang]
  return `${id === 'home' ? loader() : ''}
  <p class="turn-device" role="status">${lang === 'is' ? 'Snúðu tækinu' : 'Please rotate your device'}</p>
  <div class="shell">
    <a class="skip" href="#main">${esc(t.skip)}</a>
    ${picker(lang, t)}
    ${renderPage(id, lang).pageHtml}
  </div>
  ${drawer(lang, t)}`
}



function home(lang: Lang) {
  const t = T[lang]
  const heroAlt = lang === 'is' ? 'Áhorfendur og lýst svið á tónleikum úr myndasafni Exton' : 'An audience and illuminated concert stage from Exton’s image library'
  const enquire = hrefOf('contact', lang)
  const fact = (value: string, label: string) => `<div class="home-facts__item"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`
  const card = (c: Collection) => `<article class="pcard" style="--tile: var(--c-${TILE[c.key]})">
              <a class="pcard__img" href="${hrefOf(c.key, lang)}" tabindex="-1" aria-hidden="true"><img ${src(c.cover, '(max-width: 650px) 92vw, (max-width: 1024px) 45vw, 44vw', ` alt="" decoding="async" loading="lazy" width="1280" height="853"`)}></a>
              <div class="pcard__body">
                <div class="pcard__head">
                  <h3 class="pcard__name"><a class="pcard__link" href="${hrefOf(c.key, lang)}">${esc(pick(c.name, lang))}</a></h3>
                  <p class="pcard__town">${esc(pick(c.blurb[0], lang))}</p>
                </div>
                <dl class="pcard__meta">
                  <div><dt>${esc(t.cardPrice)}</dt><dd>${esc(pick(c.card.from, lang))}</dd></div>
                  <div><dt>${esc(t.cardRange)}</dt><dd>${esc(pick(c.card.range, lang))}</dd></div>
                  <div><dt>${esc(t.cardService)}</dt><dd>${esc(pick(c.card.service, lang))}</dd></div>
                </dl>
                <p class="pcard__go"><span class="pcard__view">${esc(t.cardView)} ${arrow(true)}</span><a class="pcard__enquire" href="${enquire}" data-prefill='${pf(c.ctaPrefill)}'>${esc(t.cardEnquire)}</a></p>
              </div>
            </article>`
  const sale = OTHER_RENTALS.map((r) => `<li class="more__row"><span class="more__name">${esc(pick(r.name, lang))}</span><a class="btn" href="${r.url}" target="_blank" rel="noopener noreferrer">${esc(t.moreView)} <svg class="glyph" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></a></li>`).join('')
  const prices = COLLECTIONS.map((c) => `<tr><th scope="row"><a href="${hrefOf(c.key, lang)}">${esc(pick(c.name, lang))}</a></th><td data-l="${t.priceDay}">${esc(pick(c.card.range, lang))}</td><td data-l="${t.priceWeek}">${esc(pick(c.card.from, lang))}</td></tr>`).join('')
  const step = (n: number, title: string, text: string) => `<li class="how__step"><span class="how__n" aria-hidden="true">${n}</span><h3 class="how__title">${esc(title)}</h3><p class="how__text">${esc(text)}</p></li>`
  const need = (title: string, text: string, link: string) => `<li class="need__row"><div><h3 class="need__title">${esc(title)}</h3><p class="need__text">${esc(text)}</p></div>${link}</li>`
  return `<div class="page" data-view="home">
      <main class="page__main home" id="main" tabindex="-1">
        <section class="frame home-hero" aria-labelledby="home-title">
          ${masthead(lang, t, 'ink')}
          <div class="home-hero__body">
            <div class="home-hero__copy">
              <h1 id="home-title" class="hero__lead home-hero__lead">${esc(t.homeLead)}</h1>
              <p class="home-hero__sub" data-intro-text>${esc(t.homeSub)}</p>
              <p class="home-hero__cta" data-intro-fade>
                <a class="btn btn--solid" href="${enquire}">${esc(t.homeCtaEnquire)}</a>
                <a class="btn" href="#verdskra" data-scroll>${esc(t.homeCtaSale)} <svg class="glyph" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5v9M2.5 7 6 10.5 9.5 7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></a>
              </p>
            </div>
            <figure class="hero__photo home-hero__photo">
              <picture>
                <img ${src('hero', '(max-width: 650px) 92vw, (max-width: 1024px) 90vw, 46vw')} alt="${esc(heroAlt)}" width="900" height="900" fetchpriority="high" decoding="async">
              </picture>
            </figure>
          </div>
          <dl class="home-facts" aria-label="${esc(t.factsAria)}" data-intro-fade>
            ${fact('2', t.factFrom)}
            ${fact(lang === 'is' ? '6 til 144 m²' : '6 to 144 m²', t.factHeight)}
            ${fact('48 / 80 m²', t.factHoist)}
            ${fact('Exton', t.factFounded)}
          </dl>
        </section>

        <section class="home-sec" id="leiga" tabindex="-1" aria-labelledby="sale-title">
          <header class="home-sec__head" data-reveal>
            <h2 class="home-sec__title" id="sale-title">${esc(t.saleTitle)}</h2>
            <p class="home-sec__text">${esc(t.saleText)}</p>
          </header>
          <div class="pgrid" data-reveal>
            ${COLLECTIONS.map(card).join('\n            ')}
          </div>
        </section>

        <section class="home-sec" id="verdskra" tabindex="-1" aria-labelledby="price-title">
          <header class="home-sec__head" data-reveal>
            <h2 class="home-sec__title" id="price-title">${esc(t.priceTitle)}</h2>
            <p class="home-sec__text">${esc(t.priceText)}</p>
          </header>
          <div class="agtable agtable--prices" data-reveal>
            <table>
              <thead><tr><th scope="col">${esc(t.priceItem)}</th><th scope="col">${esc(t.priceDay)}</th><th scope="col">${esc(t.priceWeek)}</th></tr></thead>
              <tbody>
              ${prices}
              </tbody>
            </table>
          </div>
        </section>

        <section class="home-sec" aria-labelledby="how-title">
          <header class="home-sec__head" data-reveal>
            <h2 class="home-sec__title" id="how-title">${esc(t.howTitle)}</h2>
          </header>
          <ol class="how" data-reveal>
            ${step(1, t.how1, t.how1Text)}
            ${step(2, t.how2, t.how2Text)}
            ${step(3, t.how3, t.how3Text)}
          </ol>
        </section>

        <section class="home-sec" aria-labelledby="buy-title">
          <header class="home-sec__head" data-reveal>
            <h2 class="home-sec__title" id="buy-title">${esc(t.moreTitle)}</h2>
            <p class="home-sec__text">${esc(t.moreText)}</p>
          </header>
          <div class="more" data-reveal>
            <ul class="more__list">
            ${sale}
            </ul>
          </div>
        </section>

        <section class="home-sec home-end" aria-labelledby="end-title">
          <header class="home-sec__head" data-reveal>
            <h2 class="home-sec__title" id="end-title">${esc(t.endTitle)}</h2>
            <p class="home-sec__text">${esc(t.endText)}</p>
          </header>
          <div class="end" data-reveal>
            <div class="end__office">
              <a class="end__phone" href="${PHONE.href}">${esc(PHONE.display)}</a>
              <p class="end__hours"><a href="mailto:${MAIL}">${MAIL}</a></p>
              <p class="home-hero__cta"><a class="btn btn--solid" href="${enquire}">${esc(t.homeCtaEnquire)}</a></p>
            </div>
            <ul class="need">
              ${need(t.needQuote, t.needQuoteText, `<a class="need__go" href="${PHONE.href}">${esc(t.needQuoteGo)}</a>`)}
              ${need(t.needSetup, t.needSetupText, `<a class="need__go" href="${enquire}" data-prefill='${pf({ tab: 'partners' })}'>${esc(t.needSetupGo)} ${arrow()}</a>`)}
              ${need(t.needMap, t.needMapText, `<a class="need__go" href="${MAP_URL}" target="_blank" rel="noopener noreferrer">${esc(t.needMapGo)} <svg class="glyph" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></a>`)}
            </ul>
          </div>
        </section>

        <footer class="colophon home-colophon"><small>${esc(t.colophon)}</small>${credit(t)}</footer>
      </main>
    </div>`
}


function ledger(c: Collection, lang: Lang) {
  const t = T[lang]
  const contact = hrefOf('contact', lang)
  const cell = (x: { main: { is: string; en: string }; small?: { is: string; en: string } }, cls: string, head: string) =>
    `<span class="${cls}" data-l="${head}"><b>${esc(pick(x.main, lang))}</b>${x.small ? `<small>${esc(pick(x.small, lang))}</small>` : ''}</span>`
  const [h1, h2, h3] = c.ledgerHead.map((h) => esc(pick(h, lang)))
  const rows = c.rows
    .map((r) => `            <div class="ledger__row">
              <span class="ledger__size">${esc(pick(r.title, lang))}${r.sub ? `<small>${esc(pick(r.sub, lang))}</small>` : ''}</span>
              ${cell(r.a, 'ledger__price', h2)}
              ${cell(r.b, 'ledger__price ledger__price--b', h3)}
              <span class="ledger__go"><a href="${contact}" data-route="${contact}" data-prefill='${pf(r.prefill)}'>${esc(pick(r.go, lang))} ${arrow()}</a></span>
            </div>`)
    .join('\n')
  return `        <section class="ledger" aria-labelledby="ledger-${c.key}">
          <header class="intro">
            <span class="intro__rule" aria-hidden="true"></span>
            <h2 class="intro__title" id="ledger-${c.key}">${esc(pick(c.ledgerTitle, lang))}</h2>
            <p class="intro__text">${esc(pick(c.ledgerNote, lang))}</p>
          </header>
          <div class="ledger__table">
            <div class="ledger__head" aria-hidden="true"><span>${h1}</span><span>${h2}</span><span>${h3}</span><span></span></div>
${rows}
            <p class="ledger__note"><a href="${c.source}" target="_blank" rel="noopener noreferrer">${esc(t.sourceLink)}</a></p>
          </div>
        </section>`
}

function collection(c: Collection, lang: Lang) {
  const t = T[lang]
  const i = COLLECTIONS.findIndex((x) => x.key === c.key)
  const nx = COLLECTIONS[(i + 1) % COLLECTIONS.length]
  const alt = (b: { is: string; en: string }) => esc(pick(b, lang))
  const fact = (f: Collection['facts'][number], n: number, total: number) => {
    const fig = `            <figure class="fact__figure"><img ${src(f.img, '(max-width: 650px) 70vw, 30vw', ` alt="${alt(f.alt)}" loading="lazy" decoding="async"`)} style="object-position:${f.pos || '50% 50%'}"></figure>`
    const copy = `            <div class="fact__copy${n === 2 && total === 3 ? ' fact__copy--end' : ''}">
              <h3 class="fact__stat${statCls(pick(f.stat[0], lang), pick(f.stat[1], lang))}">${esc(pick(f.stat[0], lang))}<br>${esc(pick(f.stat[1], lang))}</h3>
              <p class="fact__text">${esc(pick(f.desc, lang))}</p>
            </div>`
    return `          <article class="fact${n % 2 ? ' fact--flip' : ''}">\n${n % 2 ? `${copy}\n${fig}` : `${fig}\n${copy}`}\n          </article>`
  }
  const photoBreak = (b: { f: string; alt: { is: string; en: string } }, label: string) => `      <section class="photo-break" aria-label="${esc(label)}">
        <div class="photo-break__window"><img ${src(b.f, '100vw', ` alt="${alt(b.alt)}" loading="lazy" decoding="async"`)}></div>
      </section>`
  const slides = [...c.slides].reverse().map((s) => `                <div class="carousel__slide"><img ${src(s.f, '(max-width: 650px) 82vw, 52vw', ` alt="${alt(s.alt)}" width="594" height="766" loading="lazy" decoding="async"`)}></div>`).join('\n')
  const credit2 = (src2: string) => `<figcaption class="quote__credit">
              <p class="quote__name">Exton</p>
              <p class="quote__source">/ ${esc(pick(c.name, lang))} / ${esc(src2)}</p>
            </figcaption>`
  return `<div class="page" data-view="category" data-category="${c.key}">
      <main class="page__main" id="main" tabindex="-1">
        <div class="scene">
          <section class="frame" aria-labelledby="page-title">
            ${masthead(lang, t, 'white')}

            <div class="hero hero--category">
              <div class="hero__stack">
                <figure class="hero__photo"><img ${src(c.hero, '100vw', ` alt="${alt(c.heroAlt)}" fetchpriority="high" decoding="sync"`)}></figure>
                ${ticker(pick(c.marquee, lang))}
              </div>
              <div class="hero__copy">
                <h1 id="page-title" class="hero__lead">${esc(pick(c.lead, lang))}</h1>
                <p class="chip">${esc(pick(c.chip, lang))}</p>
                <p class="chip-note">${esc(t.chipNote)}</p>
              </div>
            </div>

            <footer class="colophon"><small>${esc(t.scrollHint)}</small></footer>
          </section>
          <div class="scene__runway" aria-hidden="true"><div class="scene__grow"></div><div class="scene__hold"></div></div>
        </div>

        <section class="gallery">
          <header class="intro">
            <span class="intro__rule" aria-hidden="true"></span>
            <h2 class="intro__title">${esc(pick(c.galleryTitle, lang))}</h2>
            <p class="intro__text">${esc(pick(c.galleryText, lang))}</p>
          </header>
          <div class="carousel">
            <div class="carousel__viewport">
              <div class="carousel__strip">
${slides}
              </div>
            </div>
            <div class="carousel__nav">
              <button type="button" class="carousel__arrow" data-step="prev" aria-label="${lang === 'is' ? 'Fyrri mynd' : 'Previous slide'}"><img src="${brand('arrow-left.svg')}" alt=""></button>
              <button type="button" class="carousel__arrow" data-step="next" aria-label="${lang === 'is' ? 'Næsta mynd' : 'Next slide'}"><img src="${brand('arrow-right.svg')}" alt=""></button>
            </div>
          </div>
        </section>

        <section class="outro">
          ${ticker(pick(c.marquee, lang), ' ticker--outro')}
          <figure class="quote">
            <img class="quote__image" ${src(c.quoteImg, '13vw', ' alt="" loading="lazy" decoding="async"')}>
            <blockquote class="quote__body"><h2 class="quote__text">${esc(pick(c.quote, lang))}</h2></blockquote>
            ${credit2(pick(c.quoteSource, lang))}
          </figure>
        </section>

${photoBreak(c.breaks[0], pick(c.labels[0], lang))}

${ledger(c, lang)}

        <section class="proof">
          <div class="facts">
${c.facts.map((f, n) => fact(f, n, c.facts.length)).join('\n')}
          </div>
${c.pull ? `          <figure class="pullquote">
            <blockquote><h3 class="pullquote__text"><span class="pullquote__mark">${lang === 'is' ? '„' : '“'}</span>${esc(pick(c.pull, lang))}${lang === 'is' ? '“' : '”'}</h3></blockquote>
            <figcaption class="pullquote__credit">
              <p class="quote__name">Exton</p>
              <p class="quote__source">/ exton.is</p>
            </figcaption>
          </figure>
` : ''}        </section>

${photoBreak(c.breaks[1], pick(c.labels[1], lang))}

        <section class="cta">
          <div class="cta__inner">
            <span class="cta__rule" aria-hidden="true"></span>
            <h2 class="cta__title">${esc(pick(c.cta, lang))}</h2>
            <h4 class="cta__link"><a class="cta__underline" href="${hrefOf('contact', lang)}" data-route="${hrefOf('contact', lang)}" data-prefill='${pf(c.ctaPrefill)}'>${esc(t.ctaLink)} ${arrow()}</a></h4>
          </div>
        </section>

        ${nextBlock(nx, lang)}
      </main>
    </div>`
}

const nextBlock = (nx: Collection, lang: Lang) => {
  const t = T[lang]
  return `<section class="next" aria-label="${esc(`${lang === 'is' ? 'Næsti vöruflokkur' : 'Next'}: ${pick(nx.name, lang)}`)}">
          <div class="next__window"><div class="next__zoom"><div class="next__drift"><img ${src(nx.hero, '100vw', ' alt="" loading="lazy" decoding="async"')}></div></div></div>
          <div class="next__shade" aria-hidden="true"></div>
          <a class="next__link" href="${hrefOf(nx.key, lang)}" data-route="${hrefOf(nx.key, lang)}">
            <span class="next__pill">${esc(t.nextLabel)}</span>
            <h2 class="next__title">${esc(pick(nx.name, lang))}</h2>
            <h6 class="next__text">${esc(`${pick(nx.blurb[0], lang)} · ${pick(nx.blurb[1], lang)}`)}</h6>
          </a>
          ${credit(t)}
        </section>`
}


function about(lang: Lang) {
  const t = T[lang]
  const a1 = COLLECTIONS[0]
  const makers = [ ['Kópavogur', 'Vesturvör 30c, 200 Kópavogur'], ['Akureyri', 'Goðanes 4, 603 Akureyri'] ].map(([name,address]) => `<li class="chronicle__item"><span class="chronicle__year chronicle__year--word">${name}</span><h3 class="chronicle__title">${address}</h3></li>`).join('')
  const people = [ ['Erling Þorgrímsson', lang === 'is' ? 'Framkvæmdastjóri leigusviðs' : 'Head of hire'], ['Adam Smári Hermannsson', lang === 'is' ? 'Deildarstjóri á Akureyri' : 'Akureyri branch manager'], ['Þór Mitchell Jensson', lang === 'is' ? 'Yfirmaður tjaldaleigu' : 'Head of tent hire'] ].map(([name,role]) => `<li class="people__item"><b>${name}</b><span>${role}</span></li>`).join('')
  const idx = t.pillars.split('|')
  const pillar = (p: (typeof PILLARS)[number], n: number) => {
    const fig = `            <figure class="fact__figure"><img ${src(p.img, '(max-width: 650px) 70vw, 30vw', ` alt="${esc(pick(p.alt, lang))}" loading="lazy" decoding="async"`)}></figure>`
    const copy = `            <div class="fact__copy">
              <p class="fact__index">${idx[n]}</p>
              <h3 class="fact__stat${statCls(pick(p.stat[0], lang), pick(p.stat[1], lang))}">${esc(pick(p.stat[0], lang))}<br>${esc(pick(p.stat[1], lang))}</h3>
              <p class="fact__text">${esc(pick(p.desc, lang))}</p>
            </div>`
    return `          <article class="fact${n % 2 ? ' fact--flip' : ''}">\n${n % 2 ? `${copy}\n${fig}` : `${fig}\n${copy}`}\n          </article>`
  }
  const statement = (label: string, lead: string, rest: string, cls: string) => `<div class="statement ${cls}">
            <p class="statement__label">${esc(label)}</p>
            <h2 class="statement__title"><span class="statement__lead">${esc(lead.trimEnd())}</span> ${esc(rest)}</h2>
          </div>`
  return `<div class="page" data-view="about" data-slug="about">
      <main class="page__main" id="main" tabindex="-1">
        <div class="scene scene--about">
          <div class="backdrop" aria-hidden="true">
            <img class="backdrop__image" ${src('branches', '100vw', ' alt="" fetchpriority="high" decoding="sync"')}>
            <span class="backdrop__shade"></span>
          </div>
          <section class="frame frame--over" aria-label="${esc(t.aboutMarquee)}">
            ${masthead(lang, t, 'white', 'about')}

            <div class="hero hero--about">
              <div class="hero__stack">
                ${ticker(t.aboutMarquee)}
              </div>
            </div>

            <footer class="colophon"><small>${esc(t.scrollHint)}</small></footer>
          </section>
        </div>

        <div class="film">
          <section class="statement statement--intro">
            <p class="statement__label">${esc(t.aboutLabel)}</p>
            <h1 class="sr-only">${esc(t.aboutH1)}</h1>
            <h2 class="statement__title"><span class="statement__lead">${esc(t.aboutStatementLead.trimEnd())}</span> ${esc(t.aboutStatement)}</h2>
            <div class="film__card">
              <div class="film__frame">
                <figure class="film__still-wrap"><img class="film__still" ${src('hero', '(max-width: 650px) 90vw, 30vw', ` alt="${esc(t.aboutFilmAlt)}" decoding="async" loading="lazy"`)}></figure>
              </div>
            </div>
            <p class="film__link"><a href="${SITE_URL}um-exton/" target="_blank" rel="noopener noreferrer">${esc(t.aboutFilmLink)}</a></p>
          </section>
          <section class="film__runway" aria-hidden="true"></section>
        </div>

        <section class="outro outro--about">
          <figure class="quote">
            <img class="quote__image" ${src('mixer', '13vw', ` alt="${esc(t.aboutQuoteAlt)}" loading="lazy" decoding="async"`)}>
            <blockquote class="quote__body"><h2 class="quote__text">${esc(t.aboutQuote)}</h2></blockquote>
          </figure>
          ${ticker(t.aboutMarquee2, ' ticker--outro')}
          ${statement(t.aboutLabel2, t.aboutValuesLead, t.aboutValues, 'statement--second')}
          <div class="facts">
${PILLARS.map(pillar).join('\n')}
          </div>
          ${statement(t.aboutLabel3, t.aboutHistoryLead, t.aboutHistory, 'statement--second statement--last')}
          <div class="chronicle">
            <ul class="chronicle__list">
${makers}
            </ul>
          </div>
          <div class="people">
            <p class="people__label statement__label">${esc(t.aboutLabel4)}</p>
            <ul class="people__list">
${people}
            </ul>
          </div>
        </section>

        <section class="photo-break" aria-label="${esc(t.aboutBreak)}">
          <div class="photo-break__window"><img ${src('stage', '100vw', ` alt="${esc(lang === 'is' ? 'Lýst tónleikasvið úr myndasafni Exton' : 'An illuminated concert stage from Exton’s image library')}" loading="lazy" decoding="async"`)}></div>
        </section>

        <section class="cta">
          <div class="cta__inner">
            <span class="cta__rule" aria-hidden="true"></span>
            <h2 class="cta__title">${esc(t.aboutCta)}</h2>
            <h4 class="cta__link"><a class="cta__underline" href="${hrefOf('hljod', lang)}" data-route="${hrefOf('hljod', lang)}">${esc(t.aboutCtaLink)} ${arrow()}</a></h4>
          </div>
        </section>

        ${nextBlock(a1, lang)}
      </main>
    </div>`
}


const deskMast = (lang: Lang, t: Record<string, string>, current: 'contact' | null) => masthead(lang, t, 'ink', current === 'contact' ? 'contact' : undefined, true)
const spin = (word: string) => `<div class="desk__spin" aria-hidden="true">
                <div class="ticker ticker--desk" data-dir="reverse">
                  <div class="ticker__mask"><div class="ticker__track"><div class="ticker__group"><span class="ticker__word">${esc(word)}</span></div></div></div>
                </div>
              </div>`
const channel = (label: string, value: string) => `                <div class="channel">
                  <p class="channel__label">${esc(label)}</p>
                  ${value}
                </div>`

const lab = (id: string, label: string) => `<label class="field__label" for="${id}">${esc(label)}</label>`
const opt = (list: string) => list.split('|').map((o) => { const i = o.indexOf(':'); const [v, l] = i > 0 && !o.startsWith('http') ? [o.slice(0, i), o.slice(i + 1)] : [o, o]; return `<option value="${esc(v)}">${esc(l)}</option>` }).join('')
const select = (id: string, name: string, label: string, options: string, required: boolean, choose: string, extra = '') => `<div class="field">${lab(id, label)}<select id="${id}" name="${name}"${required ? ' required' : ''}${extra}><option value="" disabled selected>${esc(choose)}</option>${options}</select></div>`
const input = (id: string, type: string, name: string, label: string, required = true, extra = '') => `<div class="field">${lab(id, label)}<input${type === 'email' ? ' spellcheck="false"' : ''} type="${type}" id="${id}" name="${name}"${required ? ' required' : ''}${extra}></div>`
const textarea = (id: string, label: string, required = false) => `<div class="field">${lab(id, label)}<textarea id="${id}" name="message" rows="2"${required ? ' required' : ''}></textarea></div>`
const consent = (id: string, t: Record<string, string>) => `<div class="consent"><label class="consent__label" for="${id}"><input type="checkbox" id="${id}" name="consent" value="yes" required><span class="consent__text">${esc(t.consent)}<button type="button" class="consent__policy" data-policy>${esc(t.consentLink)}</button>${esc(t.consentTail)}</span></label></div>`
const foot = (label: string) => `<div class="enquiry__foot"><button type="submit" class="enquiry__send"><span>${esc(label)}</span></button></div>`
const rows = (list: string[]) => list.map((r) => `                  ${r}`).join('\n')
const check = '<svg class="channel__tick" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5 5.5 10.5 11.5 3.5"/></svg>'
const copyBtn = (mail: string, t: Record<string, string>) => `<button type="button" class="channel__value channel__copy" data-copy="${mail}" aria-label="${esc(t.copyAria + mail)}"><span class="channel__text">${mail}</span><span class="channel__done" aria-live="polite" data-done="${esc(t.copyDone)}">${check}<span class="channel__done-text"></span></span></button>`

function deskPage(id: PageId, lang: Lang, o: { word: string; h1: string; heading: string; channels: string; aside: string; current: 'contact' | null }) {
  const t = T[lang]
  return `<div class="page page--desk" data-view="${VIEW[id]}" data-slug="${id}">
      <main class="page__main" id="main" tabindex="-1">
        <section class="desk">
          <div class="frame desk__grid">
            ${deskMast(lang, t, o.current)}
            <div class="desk__left"><h1 class="sr-only">${esc(o.h1)}</h1></div>
            <div class="desk__stack">
              ${spin(o.word)}
              <p class="desk__heading" data-intro-text>${esc(o.heading)}</p>
              <div class="desk__channels">
${o.channels}
              </div>
            </div>
            <div class="desk__aside">
${o.aside}
            </div>
            ${credit(t)}
          </div>
        </section>
      </main>
    </div>`
}

function contact(lang: Lang) {
  const t = T[lang]
  const choose = lang === 'is' ? 'Veldu' : 'Choose'
  const products = PRODUCTS.map((p) => `<option value="${p.key}">${esc(pick(p.label, lang))}</option>`).join('')
  const is = lang === 'is'
  const say = (a: string, b: string) => is ? a : b
  const today = new Date().toISOString().slice(0, 10)
  const equipment = (prefix: string) => `<div data-equipment-list><div class="field-row equipment-row" data-equipment-row>${select(prefix+'-product', 'product', t.fProduct, products, true, choose)}${input(prefix+'-qty', 'number', 'qty', t.fQty, true, ' min="1" step="1" value="1" inputmode="numeric"')}</div></div><button type="button" class="equipment-add" data-add-equipment>${say('+ Bæta við búnaði', '+ Add equipment')}</button>`
  const branch = (prefix: string, pickup = false) => select(prefix+'-branch', 'branch', pickup ? t.fPickup : say('Starfsstöð *','Branch *'), opt('kopavogur:Kópavogur|akureyri:Akureyri'), true, choose)
  const details = (prefix: string) => `<div class="field-row field-row--3">${input(prefix+'-name', 'text', 'fullname', t.fName, true, ' autocomplete="name"')}${input(prefix+'-phone','tel','phone',t.fPhone,true,' autocomplete="tel"')}${input(prefix+'-email','email','email',t.fEmail,true,' autocomplete="email"')}</div>`
  const rental = rows([
    `<p class="enquiry__hint">${esc(t.hintRental)}</p>`, equipment('r'),
    `<div class="field-row field-row--3">${input('r-from','date','from',t.fFrom,true,` min="${today}"`)}${input('r-to','date','to',t.fTo,true,` min="${today}"`)}${branch('r',true)}</div>`,
    details('r'), textarea('r-message',t.fMessage), consent('r-consent',t), foot(t.send),
  ])
  const job = rows([
    `<p class="enquiry__hint">${say('Exton flytur, setur upp, stjórnar og tekur niður.','Exton delivers, sets up, operates and removes the equipment.')}</p>`, equipment('j'),
    `<div class="field-row">${input('j-address','text','address',t.fAddress,true,' autocomplete="street-address"')}${select('j-setting','setting',say('Inni eða úti *','Indoors or outdoors *'),opt(say('indoor:Inni|outdoor:Úti|both:Bæði','indoor:Indoors|outdoor:Outdoors|both:Both')),true,choose)}</div>`,
    `<div class="field-row field-row--3">${input('j-start','date','start',t.fStart,true,` min="${today}"`)}${input('j-setup','datetime-local','setup',say('Uppsetning *','Set-up *'))}${input('j-strike','datetime-local','strike',say('Niðurtekt *','Strike *'))}</div>`,
    `<div class="field-row field-row--3">${input('j-from','date','from',t.fFrom,true,` min="${today}"`)}${input('j-to','date','to',t.fTo,true,` min="${today}"`)}${branch('j')}</div>`,
    `<div class="field-row field-row--3">${input('j-space','number','space',say('Áætlað rými, m²','Approx. space, m²'),false,' min="1" step="any"')}${input('j-guests','number','guests',say('Áætlaður gestafjöldi','Approx. attendance'),false,' min="1" step="1"')}${input('j-company','text','company',t.fCompany,false,' autocomplete="organization"')}</div>`,
    `<p class="enquiry__hint">${esc(t.hintSize)}</p>`,
    `<div class="field-row">${input('j-power','text','power',say('Rafmagn á staðnum','Power at the venue'),false)}${input('j-access','text','access',say('Aðkoma og afferming','Access and unloading'),false)}</div>`,
    `<div class="field field--file">${lab('j-photos',t.fPhotos)}<input type="file" id="j-photos" name="photos" accept="image/*" multiple aria-describedby="j-photos-hint"></div><p class="enquiry__hint" id="j-photos-hint">${esc(t.hintPhotos)}</p><div class="local-photos" data-local-photos aria-live="polite"></div>`,
    details('j'),textarea('j-message',t.fMessage),consent('j-consent',t),foot(t.send),
  ])
  return deskPage('contact', lang, {
    current: 'contact', word: t.contactWord, h1: t.contactH1, heading: t.contactHeading,
    channels: [
      channel(t.chOffice, `<a class="channel__value" href="${PHONE.href}">${esc(PHONE.display)}</a>`),
      channel(t.chMail, copyBtn(MAIL, t)),
      channel(t.chHours, `<span class="channel__value channel__plain" style="cursor:default">${esc(t.hoursText)}</span>`),
    ].join('\n'),
    aside: `              <div class="enquiry">
                <div class="enquiry__tabs" role="tablist" aria-label="${esc(t.tabsAria)}">
                  <button type="button" class="enquiry__tab is-active" role="tab" id="tab-investors" aria-selected="true" aria-controls="enquiry-investors" data-tab="investors">${esc(t.tabRental)}</button>
                  <button type="button" class="enquiry__tab" role="tab" id="tab-partners" aria-selected="false" aria-controls="enquiry-partners" data-tab="partners" tabindex="-1">${esc(t.tabJob)}</button>
                </div>
                <div class="enquiry__panels">
                <form class="enquiry__form is-active" id="enquiry-investors" data-kind="rental" novalidate role="tabpanel" aria-labelledby="tab-investors">
${rental}
                </form>
                <form class="enquiry__form" id="enquiry-partners" data-kind="job" novalidate hidden inert role="tabpanel" aria-labelledby="tab-partners">
${job}
                </form>
                </div>
                <p class="enquiry__error" role="alert" hidden>${esc(t.formError)}</p>
                <p class="enquiry__sample">${esc(t.sampleForm)}</p>
              </div>`,
  })
}

function notFound(lang: Lang) {
  const t = T[lang]
  return deskPage('404', lang, {
    current: null, word: t.notFoundWord, h1: t.notFoundTitle, heading: t.notFoundHeading,
    channels: [
      channel(t.chExplore, `<a class="channel__value" href="${hrefOf('home', lang)}">${esc(t.chBack)}</a>`),
      channel(t.chHelp, `<a class="channel__value" href="${hrefOf('contact', lang)}">${esc(t.chContactUs)}</a>`),
    ].join('\n'),
    aside: `              <div class="lost">
                <p class="lost__code" aria-hidden="true">404</p>
                <p class="lost__text">${esc(t.notFoundText)}</p>
              </div>`,
  })
}


function requests(lang: Lang) {
  const t = T[lang]
  const a1 = COLLECTIONS[0]
  const tag = `<span class="tag-sample">${esc(t.ovNoticeTag)}</span>`
  const is = lang === 'is'
  const samples = [
    { kind: is ? 'Leiga' : 'Hire', what: 'RCF '+(is ? 'pakki' : 'package')+' 2 × 1', where: is ? 'Sótt í Kópavogi' : 'Collect in Kópavogur', when: '12.06.2027 / 14.06.2027', branch: 'Kópavogur', status: is ? 'Ný' : 'New', details: [[is ? 'Þjónusta' : 'Service', is ? 'Viðskiptavinur sækir og notar' : 'Customer collects and uses'], [is ? 'Viðhengi' : 'Attachments', is ? 'Engin' : 'None'], [is ? 'Vantar' : 'Missing', is ? 'Tíma afhendingar' : 'Collection time']] },
    { kind: is ? 'Viðburður' : 'Full service', what: 'R8 15 × 8 m × 1', where: is ? 'Dæmisstaður A, Akureyri' : 'Sample venue A, Akureyri', when: '19.06.2027', branch: 'Akureyri', status: is ? 'Vantar upplýsingar' : 'Needs information', details: [[is ? 'Leigutími' : 'Hire period', '18.06.2027 / 20.06.2027'], [is ? 'Þjónusta' : 'Service', is ? 'Flutningur, uppsetning, stjórn og niðurtekt' : 'Delivery, set-up, operation and removal'], [is ? 'Uppsetning / niðurtekt' : 'Set-up / strike', '18.06.2027 10:00 / 20.06.2027 09:00'], [is ? 'Rými og gestir' : 'Space and guests', is ? 'Úti, um 200 m², um 120 gestir' : 'Outdoors, approx. 200 m², approx. 120 guests'], [is ? 'Viðhengi' : 'Attachments', is ? '2 myndir, sýnishorn af skráarheitum: adkoma.jpg, svaedi.jpg' : '2 photos, sample filenames: access.jpg, venue.jpg'], [is ? 'Vantar' : 'Missing', is ? 'Rafmagn og aðkomuupplýsingar' : 'Power and access information']] },
    { kind: is ? 'Viðburður' : 'Full service', what: 'FREESTAGE 8 × 6 m × 1', where: is ? 'Dæmisstaður B, Kópavogi' : 'Sample venue B, Kópavogur', when: '26.06.2027', branch: 'Kópavogur', status: is ? 'Í yfirferð' : 'In review', details: [[is ? 'Leigutími' : 'Hire period', '25.06.2027 / 27.06.2027'], [is ? 'Þjónusta' : 'Service', is ? 'Flutningur, uppsetning, stjórn og niðurtekt' : 'Delivery, set-up, operation and removal'], [is ? 'Uppsetning / niðurtekt' : 'Set-up / strike', '25.06.2027 12:00 / 27.06.2027 10:00'], [is ? 'Viðhengi' : 'Attachments', is ? '1 mynd, sýnishorn af skráarheiti: svidssvaedi.jpg' : '1 photo, sample filename: stage-area.jpg'], [is ? 'Vantar' : 'Missing', is ? 'Áætlaðan gestafjölda og rafmagn' : 'Approximate attendance and power']] }
  ]
  const inbox = samples.map((r,i) => `<article class="sample-request"><button class="inbox__row" type="button" aria-expanded="false" aria-controls="sample-${i}" data-inbox-toggle><span class="inbox__kind">${tag}<br>${r.kind}</span><span class="inbox__what">${r.what}</span><span class="inbox__cell" data-l="${t.ovCol3}">${r.where}</span><span class="inbox__cell" data-l="${t.ovCol4}">${r.when}</span><span class="inbox__cell" data-l="${t.ovCol5}">${r.branch}</span><span class="inbox__status">${r.status} +</span></button><div class="sample-detail" id="sample-${i}" hidden><div><p>${tag}</p><dl class="brief">${r.details.map(([label,value])=>`<div class="brief__row"><dt>${label}</dt><dd>${value}</dd></div>`).join('')}</dl></div></div></article>`).join('')
  return `<div class="page" data-view="about" data-slug="requests">
      <main class="page__main" id="main" tabindex="-1">
        <div class="scene scene--about">
          <div class="backdrop" aria-hidden="true">
            <img class="backdrop__image" ${src('branches', '100vw', ' alt="" fetchpriority="high" decoding="sync"')}>
            <span class="backdrop__shade"></span>
          </div>
          <section class="frame frame--over" aria-label="${esc(t.ovMarquee)}">
            ${masthead(lang, t, 'white')}

            <div class="hero hero--about">
              <div class="hero__stack">
                ${ticker(t.ovMarquee)}
              </div>
            </div>

            <footer class="colophon"><small>${esc(t.scrollHint)}</small></footer>
          </section>
        </div>

        <div class="film">
          <section class="statement statement--intro">
            <p class="statement__label">${esc(t.ovLabel)}</p>
            <h1 class="sr-only">${esc(t.ovH1)}</h1>
            <h2 class="statement__title"><span class="statement__lead">${esc(t.ovLead.trimEnd())}</span> ${esc(t.ovStatement)}</h2>
          </section>
        </div>

        <section class="board">
          <div class="board__notice"><div class="board__notice-in"><b>${esc(t.ovNoticeTag)}</b><span>${esc(t.ovNotice)}</span></div></div>
          <div class="board__block">
            <h2 class="board__title">${esc(t.ovInboxTitle)}<small>${esc(t.ovInboxSub)} ${tag}</small></h2>
            <div class="board__body">
              <div class="inbox">
                <div class="inbox__head" aria-hidden="true"><span>${esc(t.ovCol1)}</span><span>${esc(t.ovCol2)}</span><span>${esc(t.ovCol3)}</span><span>${esc(t.ovCol4)}</span><span>${esc(t.ovCol5)}</span><span>${esc(t.ovCol6)}</span></div>
${inbox}
              </div>
            </div>
          </div>
        </section>

        <section class="photo-break" aria-label="${esc(t.ovBreak)}">
          <div class="photo-break__window"><img ${src('hero', '100vw', ` alt="${esc(t.ovBreak)}" loading="lazy" decoding="async"`)}></div>
        </section>

        <section class="cta">
          <div class="cta__inner">
            <span class="cta__rule" aria-hidden="true"></span>
            <h2 class="cta__title">${esc(t.ovCta)}</h2>
            <h4 class="cta__link"><a class="cta__underline" href="${hrefOf('contact', lang)}" data-route="${hrefOf('contact', lang)}">${esc(t.ovCtaLink)} ${arrow()}</a></h4>
          </div>
        </section>

        ${nextBlock(a1, lang)}
      </main>
    </div>`
}


export interface Rendered { title: string; description: string; pageHtml: string; html: string; view: string; category: string; heroes: string[]; theme: string }

export function renderPage(id: PageId, lang: Lang): Rendered {
  const t = T[lang]
  const c = COLLECTIONS.find((x) => x.key === id)
  let pageHtml = ''
  let title = ''
  let description = ''
  let theme = '#ffffff'
  const heroes: string[] = []
  if (id === 'home') { pageHtml = home(lang); title = t.homeTitle; description = t.homeDesc; heroes.push(img('hero')) }
  else if (c) { pageHtml = collection(c, lang); title = `${pick(c.name, lang)} | Exton`; description = pick(c.description, lang); heroes.push(img(c.hero)); theme = '#000000' }
  else if (id === 'about') { pageHtml = about(lang); title = t.aboutTitle; description = t.aboutDesc; heroes.push(img('branches')) }
  else if (id === 'contact') { pageHtml = contact(lang); title = t.contactTitle; description = t.contactDesc }
  else if (id === 'requests') { pageHtml = requests(lang); title = t.ovTitle; description = t.ovDesc; heroes.push(img('branches')) }
  else { pageHtml = notFound(lang); title = t.notFoundTitle; description = t.notFoundDesc }
  const html = `<!doctype html><html lang="${lang}"><head><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="noindex, nofollow"></head><body data-page="${VIEW[id]}"${c ? ` data-category="${c.key}"` : ''}>${pageHtml}</body></html>`
  return { title, description, pageHtml, html, view: VIEW[id], category: c ? c.key : '', heroes, theme }
}
