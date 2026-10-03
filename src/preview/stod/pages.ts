import {
  COLLECTIONS, FLAT, FOLDING, FOR_SALE, HEIGHTS, HOIST, JOBS, MAIL, MAP_URL, PHONE, PILLARS, PRODUCTS, PROPS, QUOTE_PHONE, ROUTE_EN, ROUTE_IS,
  SAMPLE_BRIEF, SAMPLE_REQUESTS, SITE_URL, SUPPLIERS, T, TOWERS, brand, img, kr, pick, type Collection, type Lang,
} from './data'

/* Markup for every page of /preview/stod, as strings. The structure, class names and order are those of the BYGG build
   (src/preview/bygg/pages.ts), itself the Realevate clean-room rebuild's generated pages; the copy, prices and the request
   flow are STOÐ's. The motion engine (motion.ts) takes the `.page` element out of these strings the way the reference's
   router took it out of the fetched HTML. */

export type PageId = 'home' | 'hjolapallar' | 'vinnupallar' | 'viralyftur' | 'stigar' | 'about' | 'contact' | 'requests' | '404'
export const PAGE_IDS: PageId[] = ['home', 'hjolapallar', 'vinnupallar', 'viralyftur', 'stigar', 'about', 'contact', 'requests', '404']

const SLUG: Record<PageId, { is: string; en: string }> = {
  home: { is: '', en: '' },
  hjolapallar: { is: '/hjolapallar', en: '/mobile-towers' },
  vinnupallar: { is: '/vinnupallar', en: '/scaffolding' },
  viralyftur: { is: '/viralyftur', en: '/platforms' },
  stigar: { is: '/stigar-og-troppur', en: '/ladders' },
  about: { is: '/um-okkur', en: '/about' },
  contact: { is: '/fa-tilbod', en: '/quote' },
  requests: { is: '/beidnir', en: '/requests' },
  '404': { is: '/404', en: '/404' },
}
const VIEW: Record<PageId, string> = { home: 'home', hjolapallar: 'category', vinnupallar: 'category', viralyftur: 'category', stigar: 'category', about: 'about', contact: 'contact', requests: 'about', '404': '404' }

export const basePath = (lang: Lang) => (lang === 'is' ? ROUTE_IS : ROUTE_EN)
export const keyOf = (id: PageId, lang: Lang) => SLUG[id][lang] || '/'
export const hrefOf = (id: PageId, lang: Lang) => `${basePath(lang)}${SLUG[id][lang]}/`
export const idOfKey = (key: string, lang: Lang): PageId => PAGE_IDS.find((id) => keyOf(id, lang) === key) ?? '404'
export const routeList = (lang: Lang) => PAGE_IDS.map((id) => ({ key: keyOf(id, lang), slug: SLUG[id][lang], view: VIEW[id], category: COLLECTIONS.some((c) => c.key === id) ? id : '' }))

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
/* a stat word of 14 letters or more is wider than the fact column at the reference size, so it gets a smaller size */
const statCls = (...w: string[]) => (w.join(' ').split(/\s+/).some((x) => x.length >= 12) ? ' fact__stat--long' : '')
const pf = (o: Record<string, string>) => esc(JSON.stringify(o))

/* srcset widths per file (small copy = "-s"), as encoded (harvest/widths.json) */
const WIDTHS: Record<string, [number, number]> = {
  hero: [1293, 646], 'hj-tvo': [1280, 640], 'hj-ein': [1280, 640],
  'vp-2': [1200, 600], 'vp-3': [1200, 600], 'vp-4': [1200, 600], 'vl-detail': [1000, 500],
  'st-troppu': [1280, 640], 'st-troppu2': [1280, 640], 'st-stigar': [1280, 640], 'st-stigi': [1280, 640], 'st-stod': [1280, 640],
  'pj-torfufell': [1200, 600], 'pj-stelksholar': [1200, 600], 'pj-vesturberg': [1200, 600], 'pj-arnarhvoll': [1200, 600], 'pj-grandagardur': [1200, 600], 'pj-hofdabakki': [1200, 600],
}
const src = (f: string, sizes: string, extra = '') => {
  const w = WIDTHS[f] ?? [1920, 960]
  return `src="${img(f)}" srcset="${img(`${f}-s`)} ${w[1]}w, ${img(f)} ${w[0]}w" sizes="${sizes}"${extra}`
}
const arrow = (white = false) => `<img src="${brand(white ? 'arrow-white.svg' : 'arrow.svg')}" alt="" width="17" height="15">`

/* ---------------------------------------------------------------- shared partials */
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
          <a class="brand" href="${hrefOf('home', lang)}" aria-label="${esc(t.brand)}"><img src="${brand(`stod-logo-${logo}.svg`)}" alt="${esc(t.logoAlt)}" width="138" height="60"></a>
          <a class="navlink navlink--start" href="${hrefOf('about', lang)}"${current === 'about' ? ' aria-current="page"' : ''}>${esc(t.about)}</a>
          <a class="navlink navlink--end" href="${hrefOf('contact', lang)}"${current === 'contact' ? ' aria-current="page"' : ''}>${esc(t.contact)}</a>
          <button class="menu-top" type="button" aria-label="${esc(t.menuOpen)}" aria-expanded="false" data-drawer-toggle data-intro-fade><span>${esc(t.menuLabel)}</span><svg viewBox="0 0 23 12" aria-hidden="true"><rect width="23" height="3"/><rect class="bar-short" y="9" width="10" height="3"/></svg></button>
          ${withDock ? dock(t) : ''}
        </header>`

const ticker = (word: string, cls = '', attrs = '') => `<div class="ticker${cls}"${attrs} aria-hidden="true">
              <div class="ticker__mask"><div class="ticker__track"><div class="ticker__group"><span class="ticker__word">${esc(word)}</span></div></div></div>
            </div>`

/* the reference's four colour hooks (sea, green, urban, rare) carry the four STOÐ product-family colours */
const TILE: Record<string, string> = { hjolapallar: 'sea', vinnupallar: 'green', viralyftur: 'urban', stigar: 'rare' }
/* advance width in em of each vertical tile name (Hanken Grotesk 500, tracking -0.02em, measured with fontTools) */
const NAME_EM: Record<string, { is: number; en: number }> = { hjolapallar: { is: 4.7, en: 6.15 }, vinnupallar: { is: 4.95, en: 4.82 }, viralyftur: { is: 4.1, en: 9.23 }, stigar: { is: 7.37, en: 7.91 } }

const picker = (lang: Lang, t: Record<string, string>) => `<nav class="picker" aria-label="${esc(t.pickerAria)}" aria-hidden="true">
      <ul class="picker__grid">
        <li class="picker__slot" data-slot="home" hidden>
          <a class="tile tile--light" href="${hrefOf('home', lang)}" data-route="${hrefOf('home', lang)}">
            <span class="tile__panel">
              <img class="tile__mark" src="${brand('stod-mark-blue.svg')}" alt="">
              <span class="tile__name">${esc(t.homeTile)}</span>
              <span class="tile__blurb">${esc(t.homeTileBlurb)}</span>
            </span>
            <span class="tile__cover"><img data-src="${img('hero-s')}" alt=""></span>
          </a>
        </li>
${COLLECTIONS.map((c) => `        <li class="picker__slot" data-slot="${c.key}">
          <a class="tile" href="${hrefOf(c.key, lang)}" data-route="${hrefOf(c.key, lang)}" style="--tile: var(--c-${TILE[c.key]}); --nw: ${NAME_EM[c.key]?.[lang] ?? 8}">
            <span class="tile__panel">
              <img class="tile__mark" src="${brand('stod-mark-white.svg')}" alt="">
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
    <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="${esc(t.nav)}">
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

/* ---------------------------------------------------------------- home */
/* A plain scrolling page: what STOÐ hires out with the published price, what it sells and from whom, how the request
   works, the price list at a glance, who to call. Everything a customer needs is in the HTML. */
function home(lang: Lang) {
  const t = T[lang]
  const heroAlt = lang === 'is' ? 'Rautt hús HB Granda klætt vinnupöllum og neti' : "HB Grandi's red building wrapped in scaffolding and netting"
  const enquire = hrefOf('contact', lang)
  const fact = (value: string, label: string) => `<div class="home-facts__item"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`
  const card = (c: Collection) => `<article class="pcard" style="--tile: var(--c-${TILE[c.key]})">
              <a class="pcard__img" href="${hrefOf(c.key, lang)}" tabindex="-1" aria-hidden="true"><img ${src(c.cover, '(max-width: 650px) 92vw, (max-width: 1024px) 45vw, 44vw', ` alt="" decoding="async" width="1280" height="853"`)}></a>
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
  const sale = FOR_SALE.map((s) => `<li class="more__row more__row--sale">
              <span class="more__name">${esc(pick(s.name, lang))}</span>
              <span class="more__makers">${s.from.map((k) => `<a href="${SUPPLIERS[k].url}" target="_blank" rel="noopener noreferrer">${esc(SUPPLIERS[k].name)} <span aria-hidden="true">↗</span></a>`).join('')}</span>
              <span class="more__links"><a href="${enquire}" data-prefill='${pf({ tab: 'partners', need: 'unsure' })}'>${esc(t.moreAsk)}</a></span>
            </li>`).join('\n            ')
  const d = (n: number) => esc(kr(n, lang))
  const priceRow = (name: string, sub: string, day: string, week: string, href: string) => `<tr>
                <th scope="row"><a href="${href}">${esc(name)}</a><small>${esc(sub)}</small></th>
                ${week ? `<td data-l="${esc(t.priceDay)}">${day}</td>
                <td data-l="${esc(t.priceWeek)}">${week}</td>` : `<td colspan="2">${day}</td>`}
              </tr>`
  const lo = TOWERS[0], hi = TOWERS[TOWERS.length - 1]
  const towerHref = hrefOf('hjolapallar', lang), stigHref = hrefOf('stigar', lang)
  const prices = [
    priceRow(lang === 'is' ? 'Hjólapallur, einfaldur' : 'Mobile tower, single', lang === 'is' ? `vinnuhæð ${String(lo.work).replace('.', ',')}-${String(hi.work).replace('.', ',')} m` : `working height ${lo.work}-${hi.work} m`, `${esc(t.priceFrom)} ${d(lo.single[0])}`, `${esc(t.priceFrom)} ${d(lo.single[1])}`, towerHref),
    priceRow(lang === 'is' ? 'Hjólapallur, tvöfaldur' : 'Mobile tower, double', lang === 'is' ? `vinnuhæð ${String(lo.work).replace('.', ',')}-${String(hi.work).replace('.', ',')} m` : `working height ${lo.work}-${hi.work} m`, `${esc(t.priceFrom)} ${d(lo.double[0])}`, `${esc(t.priceFrom)} ${d(lo.double[1])}`, towerHref),
    priceRow(lang === 'is' ? 'Samanbrotinn hjólapallur' : 'Folding tower', lang === 'is' ? `vinnuhæð ${FOLDING.work.is}` : `working height ${FOLDING.work.en}`, d(FOLDING.day), d(FOLDING.week), towerHref),
    priceRow(lang === 'is' ? 'Stigar, tröppur, þakstigar' : 'Ladders, steps, roof ladders', lang === 'is' ? 'sama verð' : 'same price', d(FLAT.ladder[0]), d(FLAT.ladder[1]), stigHref),
    priceRow(lang === 'is' ? 'Loftastoðir' : 'Ceiling props', lang === 'is' ? `${PROPS.len.is}, á stykki` : `${PROPS.len.en}, each`, d(PROPS.day), d(PROPS.week), stigHref),
    priceRow(lang === 'is' ? 'Víralyfta, Power climber' : 'Suspended platform', HOIST.len[lang], '<span class="agtable__na">-</span>', d(HOIST.week), hrefOf('viralyftur', lang)),
    priceRow(lang === 'is' ? 'Vinnupallar og net' : 'Scaffolding and netting', lang === 'is' ? 'með eða án uppsetningar' : 'with or without set-up', `<span class="agtable__quote">${esc(t.priceQuote)}</span>`, '', hrefOf('vinnupallar', lang)),
  ].join('\n              ')
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
                <a class="btn" href="#verdskra" data-scroll>${esc(t.homeCtaSale)} <span aria-hidden="true">↓</span></a>
              </p>
            </div>
            <figure class="hero__photo home-hero__photo">
              <picture>
                <img ${src('hero', '(max-width: 650px) 92vw, (max-width: 1024px) 90vw, 46vw')} alt="${esc(heroAlt)}" width="1293" height="1035" fetchpriority="high" decoding="async">
              </picture>
            </figure>
          </div>
          <dl class="home-facts" aria-label="${esc(t.factsAria)}" data-intro-fade>
            ${fact(kr(FOLDING.day, lang), t.factFrom)}
            ${fact(lang === 'is' ? '11,5 m' : '11.5 m', t.factHeight)}
            ${fact('1-14 m', t.factHoist)}
            ${fact('2009', t.factFounded)}
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
              ${need(t.needQuote, t.needQuoteText, `<a class="need__go" href="${QUOTE_PHONE.href}">${esc(t.needQuoteGo)}</a>`)}
              ${need(t.needSetup, t.needSetupText, `<a class="need__go" href="${enquire}" data-prefill='${pf({ tab: 'partners', assembly: 'yes' })}'>${esc(t.needSetupGo)} ${arrow()}</a>`)}
              ${need(t.needMap, t.needMapText, `<a class="need__go" href="${MAP_URL}" target="_blank" rel="noopener noreferrer">${esc(t.needMapGo)} <span aria-hidden="true">↗</span></a>`)}
            </ul>
          </div>
        </section>

        <footer class="colophon home-colophon"><small>${esc(t.colophon)}</small>${credit(t)}</footer>
      </main>
    </div>`
}

/* ---------------------------------------------------------------- collections */
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
              <p class="quote__name">STOÐ pallaleiga</p>
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
            <blockquote class="quote__body"><h2 class="quote__text">${esc(lang === 'is' ? `„${pick(c.quote, lang)}“` : `“${pick(c.quote, lang)}”`)}</h2></blockquote>
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
              <p class="quote__name">STOÐ pallaleiga</p>
              <p class="quote__source">/ pallaleiga.is</p>
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

/* ---------------------------------------------------------------- about */
function about(lang: Lang) {
  const t = T[lang]
  const a1 = COLLECTIONS[0]
  const makers = FOR_SALE.map((s) => `            <li class="chronicle__item"><span class="chronicle__year chronicle__year--word">${esc(pick(s.name, lang))}</span><div><h3 class="chronicle__title">${s.from.map((k) => `<a href="${SUPPLIERS[k].url}" target="_blank" rel="noopener noreferrer">${esc(SUPPLIERS[k].name)}</a>`).join(lang === 'is' ? ' og ' : ' and ')}</h3></div></li>`).join('\n')
  const people = [
    { name: QUOTE_PHONE.name, role: lang === 'is' ? `Tilboð í verk · <a href="${QUOTE_PHONE.href}">${QUOTE_PHONE.display}</a>` : `Quotes for jobs · <a href="${QUOTE_PHONE.href}">${QUOTE_PHONE.display}</a>` },
    { name: lang === 'is' ? 'Skrifstofa' : 'Office', role: `<a href="${PHONE.href}">${PHONE.display}</a> · <a href="mailto:${MAIL}">${MAIL}</a>` },
    { name: 'Tunguháls 17', role: `110 Reykjavík · ${esc(t.hoursShort)}` },
  ].map((p) => `            <li class="people__item"><b>${esc(p.name)}</b><span>${p.role}</span></li>`).join('\n')
  const jobs = JOBS.map((j) => `            <figure class="jobs__item"><img ${src(j.f, '(max-width: 650px) 92vw, 30vw', ` alt="${esc(j.label)}" loading="lazy" decoding="async" width="1200" height="675"`)}><figcaption>${esc(j.label)}</figcaption></figure>`).join('\n')
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
            <img class="backdrop__image" ${src('vp-4', '100vw', ' alt="" fetchpriority="high" decoding="sync"')}>
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
                <figure class="film__still-wrap"><img class="film__still" ${src('vp-2', '(max-width: 650px) 90vw, 30vw', ` alt="${esc(t.aboutFilmAlt)}" decoding="async"`)}></figure>
              </div>
            </div>
            <p class="film__link"><a href="${SITE_URL}um-okkur/" target="_blank" rel="noopener noreferrer">${esc(t.aboutFilmLink)}</a></p>
          </section>
          <section class="film__runway" aria-hidden="true"></section>
        </div>

        <section class="outro outro--about">
          <figure class="quote">
            <img class="quote__image" ${src('hj-ein', '13vw', ` alt="${esc(t.aboutQuoteAlt)}" loading="lazy" decoding="async"`)}>
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
          <div class="jobs">
            <p class="jobs__label statement__label">${esc(t.jobsLabel)}</p>
            <p class="jobs__text">${esc(t.jobsText)}</p>
            <div class="jobs__grid">
${jobs}
            </div>
          </div>
          <div class="people">
            <p class="people__label statement__label">${esc(t.aboutLabel4)}</p>
            <ul class="people__list">
${people}
            </ul>
          </div>
        </section>

        <section class="photo-break" aria-label="${esc(t.aboutBreak)}">
          <div class="photo-break__window"><img ${src('vp-kerfi', '100vw', ` alt="${esc(lang === 'is' ? 'Kerfispallar utan um hús í byggingu' : 'System scaffolding around a building under construction')}" loading="lazy" decoding="async"`)}></div>
        </section>

        <section class="cta">
          <div class="cta__inner">
            <span class="cta__rule" aria-hidden="true"></span>
            <h2 class="cta__title">${esc(t.aboutCta)}</h2>
            <h4 class="cta__link"><a class="cta__underline" href="${hrefOf('hjolapallar', lang)}" data-route="${hrefOf('hjolapallar', lang)}">${esc(t.aboutCtaLink)} ${arrow()}</a></h4>
          </div>
        </section>

        ${nextBlock(a1, lang)}
      </main>
    </div>`
}

/* ---------------------------------------------------------------- desk pages (request, 404) */
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
/* visible labels on every field (the brief asks for them; the reference used placeholders only) */
const lab = (id: string, label: string) => `<label class="field__label" for="${id}">${esc(label)}</label>`
const opt = (list: string) => list.split('|').map((o) => { const i = o.indexOf(':'); const [v, l] = i > 0 && !o.startsWith('http') ? [o.slice(0, i), o.slice(i + 1)] : [o, o]; return `<option value="${esc(v)}">${esc(l)}</option>` }).join('')
const select = (id: string, name: string, label: string, options: string, required: boolean, choose: string, extra = '') => `<div class="field">${lab(id, label)}<select id="${id}" name="${name}"${required ? ' required' : ''}${extra}><option value="" disabled selected>${esc(choose)}</option>${options}</select></div>`
const input = (id: string, type: string, name: string, label: string, required = true, extra = '') => `<div class="field">${lab(id, label)}<input${type === 'email' ? ' spellcheck="false"' : ''} type="${type}" id="${id}" name="${name}"${required ? ' required' : ''}${extra}></div>`
const textarea = (id: string, label: string, required = false) => `<div class="field">${lab(id, label)}<textarea id="${id}" name="message" rows="2"${required ? ' required' : ''}></textarea></div>`
const consent = (id: string, t: Record<string, string>) => `<div class="consent"><label class="consent__label" for="${id}"><input type="checkbox" id="${id}" name="consent" value="yes" required><span class="consent__text">${esc(t.consent)}<button type="button" class="consent__policy" data-policy>${esc(t.consentLink)}</button>${esc(t.consentTail)}</span></label></div>`
const foot = (label: string) => `<div class="enquiry__foot"><button type="submit" class="enquiry__send"><span>${esc(label)}</span></button></div>`
const rows = (list: string[]) => list.map((r) => `                  ${r}`).join('\n')
const check = '<svg class="channel__tick" viewBox="0 0 14 14" aria-hidden="true"><path d="M2.5 7.5 5.5 10.5 11.5 3.5"/></svg>'
const copyBtn = (mail: string, t: Record<string, string>) => `<button type="button" class="channel__value channel__copy" data-copy="${mail}" aria-label="${esc(t.copyAria + mail)}"><span class="channel__text">${mail}</span><span class="channel__done" aria-live="polite">${check}${esc(t.copyDone)}</span></button>`

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
  const heights = HEIGHTS.map((h, i) => `<option value="${i}">${esc(pick(h, lang))}</option>`).join('')
  const today = new Date().toISOString().slice(0, 10)
  const rental = rows([
    `<div class="field-row">${select('r-product', 'product', t.fProduct, products, true, choose)}${select('r-height', 'height', t.fHeight, heights, false, choose)}</div>`,
    `<div class="enquiry__estimate" data-estimate aria-live="polite">${esc(t.hintRental)}</div>`,
    `<div class="field-row field-row--3">${input('r-from', 'date', 'from', t.fFrom, true, ` min="${today}"`)}${select('r-period', 'period', t.fPeriod, opt(t.optPeriod), false, choose)}${input('r-qty', 'number', 'qty', t.fQty, false, ' inputmode="numeric" min="1" step="1" autocomplete="off"')}</div>`,
    `<div class="field-row">${select('r-pickup', 'pickup', t.fPickup, opt(t.optPickup), false, choose)}${input('r-place', 'text', 'place', t.fPlace, false, ' autocomplete="street-address"')}</div>`,
    `<div class="field-row field-row--3">${input('r-name', 'text', 'fullname', t.fName, true, ' autocomplete="name"')}${input('r-phone', 'tel', 'phone', t.fPhone, true, ' autocomplete="tel" inputmode="tel"')}${input('r-email', 'email', 'email', t.fEmail, true, ' autocomplete="email"')}</div>`,
    textarea('r-message', t.fMessage),
    consent('r-consent', t), foot(t.send),
  ])
  const job = rows([
    `<div class="field-row">${select('j-need', 'need', t.fNeed, opt(t.optNeed), true, choose)}${select('j-assembly', 'assembly', t.fAssembly, opt(t.optAssembly), true, choose)}</div>`,
    `<div class="field-row">${input('j-address', 'text', 'address', t.fAddress, true, ' autocomplete="street-address"')}${select('j-task', 'task', t.fTask, opt(t.optTask), false, choose)}</div>`,
    `<div class="field-row field-row--3">${input('j-length', 'number', 'length', t.fLength, false, ' inputmode="decimal" min="0" step="0.5" aria-describedby="j-size-hint"')}${input('j-tall', 'number', 'tall', t.fTall, false, ' inputmode="decimal" min="0" step="0.5" aria-describedby="j-size-hint"')}${input('j-start', 'date', 'start', t.fStart, false, ` min="${today}"`)}</div>`,
    `<p class="enquiry__hint" id="j-size-hint">${esc(t.hintSize)}</p>`,
    `<div class="field-row">${select('j-duration', 'duration', t.fDuration, opt(t.optDuration), false, choose)}<div class="field field--file">${lab('j-photos', t.fPhotos)}<input type="file" id="j-photos" name="photos" accept="image/*" multiple aria-describedby="j-photos-hint"></div></div>`,
    `<p class="enquiry__hint" id="j-photos-hint">${esc(t.hintPhotos)}</p>`,
    `<div class="field-row">${input('j-name', 'text', 'fullname', t.fName, true, ' autocomplete="name"')}${input('j-company', 'text', 'company', t.fCompany, false, ' autocomplete="organization"')}</div>`,
    `<div class="field-row">${input('j-phone', 'tel', 'phone', t.fPhone, true, ' autocomplete="tel" inputmode="tel"')}${input('j-email', 'email', 'email', t.fEmail, true, ' autocomplete="email"')}</div>`,
    textarea('j-message', t.fMessage),
    consent('j-consent', t), foot(t.send),
  ])
  return deskPage('contact', lang, {
    current: 'contact', word: t.contactWord, h1: t.contactH1, heading: t.contactHeading,
    channels: [
      channel(t.chOffice, `<a class="channel__value" href="${PHONE.href}">${esc(PHONE.display)}</a>`),
      channel(t.chQuote, `<a class="channel__value" href="${QUOTE_PHONE.href}">${esc(QUOTE_PHONE.display)}</a>`),
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

/* ---------------------------------------------------------------- requests (sample data) */
function requests(lang: Lang) {
  const t = T[lang]
  const a1 = COLLECTIONS[0]
  const tag = `<span class="tag-sample">${esc(t.ovNoticeTag)}</span>`
  const inbox = SAMPLE_REQUESTS.map((r) => `              <div class="inbox__row${r.flag ? ' inbox__row--flag' : ''}">
                <span class="inbox__kind"><span class="sr-only">${esc(t.ovCol1)}: </span>${esc(pick(r.kind, lang))}</span>
                <span class="inbox__what"><span class="sr-only">${esc(t.ovCol2)}: </span>${esc(pick(r.what, lang))}</span>
                <span class="inbox__cell" data-l="${esc(t.ovCol3)}"><span class="sr-only">${esc(t.ovCol3)}: </span>${esc(pick(r.where, lang))}</span>
                <span class="inbox__cell" data-l="${esc(t.ovCol4)}"><span class="sr-only">${esc(t.ovCol4)}: </span>${esc(pick(r.when, lang))}</span>
                <span class="inbox__cell" data-l="${esc(t.ovCol5)}"><span class="sr-only">${esc(t.ovCol5)}: </span>${esc(pick(r.size, lang))}</span>
                <span class="inbox__status"><span class="sr-only">${esc(t.ovCol6)}: </span>${esc(pick(r.status, lang))}</span>
              </div>`).join('\n')
  const brief = SAMPLE_BRIEF.map(([k, v]) => `                <div class="brief__row"><dt>${esc(pick(k, lang))}</dt><dd>${esc(pick(v, lang))}</dd></div>`).join('\n')
  return `<div class="page" data-view="about" data-slug="requests">
      <main class="page__main" id="main" tabindex="-1">
        <div class="scene scene--about">
          <div class="backdrop" aria-hidden="true">
            <img class="backdrop__image" ${src('vp-3', '100vw', ' alt="" fetchpriority="high" decoding="sync"')}>
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
          <div class="board__block">
            <h2 class="board__title">${esc(t.ovBriefTitle)}<small>${esc(t.ovBriefSub)} ${tag}</small></h2>
            <div class="board__body">
              <dl class="brief">
${brief}
              </dl>
            </div>
          </div>
        </section>

        <section class="photo-break" aria-label="${esc(t.ovBreak)}">
          <div class="photo-break__window"><img ${src('vp-grandi', '100vw', ` alt="${esc(t.ovBreak)}" loading="lazy" decoding="async"`)}></div>
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

/* ---------------------------------------------------------------- entry points */
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
  else if (c) { pageHtml = collection(c, lang); title = `${pick(c.name, lang)} | STOÐ pallaleiga`; description = pick(c.description, lang); heroes.push(img(c.hero)); theme = '#000000' }
  else if (id === 'about') { pageHtml = about(lang); title = t.aboutTitle; description = t.aboutDesc; heroes.push(img('vp-4')) }
  else if (id === 'contact') { pageHtml = contact(lang); title = t.contactTitle; description = t.contactDesc }
  else if (id === 'requests') { pageHtml = requests(lang); title = t.ovTitle; description = t.ovDesc; heroes.push(img('vp-3')) }
  else { pageHtml = notFound(lang); title = t.notFoundTitle; description = t.notFoundDesc }
  const html = `<!doctype html><html lang="${lang}"><head><title>${esc(title)}</title></head><body data-page="${VIEW[id]}"${c ? ` data-category="${c.key}"` : ''}>${pageHtml}</body></html>`
  return { title, description, pageHtml, html, view: VIEW[id], category: c ? c.key : '', heroes, theme }
}
