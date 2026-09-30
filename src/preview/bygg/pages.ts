import {
  AGENCY, COLLECTIONS, FROM_PRICE, HISTORY, HISTORY_EN, HMS_URL, PEOPLE, PHONE, PILLARS, RENTALS, RENTAL_MAIL, ROUTE_EN, ROUTE_IS,
  SALE_PROJECTS, SAMPLE, SERVICE_MAIL, T, brand, collectionOf, img, mkr, pick, type Collection, type Lang,
} from './data'

/* Markup for every page of /preview/bygg, as strings. The structure, class names and order are those of the Realevate
   clean-room rebuild's generated pages (scripts/build-pages.mjs, build-secondary.mjs); the copy is BYGG's. The motion
   engine (motion.ts) takes the `.page` element out of these strings the way the reference's router took it out of the
   fetched HTML. */

export type PageId = 'home' | 'asvellir' | 'bolholt' | 'fossvogsvegur' | 'asparlaut' | 'about' | 'contact' | 'my' | 'overview' | '404'
export const PAGE_IDS: PageId[] = ['home', 'asvellir', 'bolholt', 'fossvogsvegur', 'asparlaut', 'about', 'contact', 'my', 'overview', '404']

const SLUG: Record<PageId, { is: string; en: string }> = {
  home: { is: '', en: '' },
  asvellir: { is: '/asvellir', en: '/asvellir' },
  bolholt: { is: '/bolholt', en: '/bolholt' },
  fossvogsvegur: { is: '/fossvogsvegur', en: '/fossvogsvegur' },
  asparlaut: { is: '/asparlaut', en: '/asparlaut' },
  about: { is: '/um-okkur', en: '/about' },
  contact: { is: '/hafa-samband', en: '/contact' },
  my: { is: '/min-ibud', en: '/my-home' },
  overview: { is: '/yfirlit', en: '/overview' },
  '404': { is: '/404', en: '/404' },
}
const VIEW: Record<PageId, string> = { home: 'home', asvellir: 'category', bolholt: 'category', fossvogsvegur: 'category', asparlaut: 'category', about: 'about', contact: 'contact', my: 'contact', overview: 'about', '404': '404' }

export const basePath = (lang: Lang) => (lang === 'is' ? ROUTE_IS : ROUTE_EN)
export const keyOf = (id: PageId, lang: Lang) => SLUG[id][lang] || '/'
export const hrefOf = (id: PageId, lang: Lang) => `${basePath(lang)}${SLUG[id][lang]}/`
export const idOfKey = (key: string, lang: Lang): PageId => PAGE_IDS.find((id) => keyOf(id, lang) === key) ?? '404'
export const routeList = (lang: Lang) => PAGE_IDS.map((id) => ({ key: keyOf(id, lang), slug: SLUG[id][lang], view: VIEW[id], category: COLLECTIONS.some((c) => c.key === id) ? id : '' }))

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const NB = ' '
/* a stat word of 14 letters or more ("Professionalism") is wider than the fact column at the reference size, so it gets a smaller size */
const statCls = (...w: string[]) => (w.join(' ').split(/\s+/).some((x) => x.length >= 14) ? ' fact__stat--long' : '')

/* srcset widths per file (small copy = "-s") */
const WIDTHS: Record<string, [number, number] | null> = {
  'ab-sjaland': [2400, 1200], 'ab-lundur': [2400, 1200], 'ab-founders': [1600, 800], 'ab-timi': [1600, 800], 'ab-workers': null, 'ab-team': null,
  hero: [1080, 540], 'ap-2': [1200, 600], 'ap-3': [1200, 600],
}
const src = (f: string, sizes: string, extra = '') => {
  const w = f in WIDTHS ? WIDTHS[f] : [1920, 960]
  return w ? `src="${img(f)}" srcset="${img(`${f}-s`)} ${w[1]}w, ${img(f)} ${w[0]}w" sizes="${sizes}"${extra}` : `src="${img(f)}"${extra}`
}

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
          <a class="brand" href="${hrefOf('home', lang)}" aria-label="${esc(t.brand)}"><img src="${brand(`bygg-wordmark-${logo}.svg`)}" alt="${esc(t.logoAlt)}" width="137" height="55"></a>
          <a class="navlink navlink--start" href="${hrefOf('about', lang)}"${current === 'about' ? ' aria-current="page"' : ''}>${esc(t.about)}</a>
          <a class="navlink navlink--end" href="${hrefOf('contact', lang)}"${current === 'contact' ? ' aria-current="page"' : ''}>${esc(t.contact)}</a>
          <button class="menu-top" type="button" aria-label="${esc(t.menuOpen)}" aria-expanded="false" data-drawer-toggle data-intro-fade><span>${esc(t.menuLabel)}</span><svg viewBox="0 0 23 12" aria-hidden="true"><rect width="23" height="3"/><rect class="bar-short" y="9" width="10" height="3"/></svg></button>
          ${withDock ? dock(t) : ''}
        </header>`

const ticker = (word: string, cls = '', attrs = '') => `<div class="ticker${cls}"${attrs} aria-hidden="true">
              <div class="ticker__mask"><div class="ticker__track"><div class="ticker__group"><span class="ticker__word">${esc(word)}</span></div></div></div>
            </div>`

const picker = (lang: Lang, t: Record<string, string>) => `<nav class="picker" aria-label="${esc(t.pickerAria)}" aria-hidden="true">
      <ul class="picker__grid">
        <li class="picker__slot" data-slot="home" hidden>
          <a class="tile tile--light" href="${hrefOf('home', lang)}" data-route="${hrefOf('home', lang)}">
            <span class="tile__panel">
              <img class="tile__mark" src="${brand('bygg-house-ink.svg')}" alt="">
              <span class="tile__name">${esc(t.homeTile)}</span>
              <span class="tile__blurb">${esc(t.homeTileBlurb)}</span>
            </span>
            <span class="tile__cover"><img data-src="${img('hero')}" alt=""></span>
          </a>
        </li>
${COLLECTIONS.map((c) => `        <li class="picker__slot" data-slot="${c.key}">
          <a class="tile" href="${hrefOf(c.key, lang)}" data-route="${hrefOf(c.key, lang)}" style="--tile: var(--c-${TILE[c.key]}); --nw: ${NAME_EM[c.key]?.[lang] ?? 8}">
            <span class="tile__panel">
              <img class="tile__mark" src="${brand('bygg-house-white.svg')}" alt="">
              <span class="tile__name">${esc(pick(c.name, lang))}</span>
              <span class="tile__blurb">${esc(pick(c.blurb[0], lang))} <br>${esc(pick(c.blurb[1], lang))}</span>
            </span>
            <span class="tile__cover"><img data-src="${img(`${c.cover}-s`)}" alt=""></span>
          </a>
        </li>`).join('\n')}
      </ul>
    </nav>`
/* the reference's four colour hooks (sea, green, urban, rare) carry the four BYGG collection colours */
/* advance width in em of each vertical tile name (Albert Sans 500, tracking -0.02em, measured with fontTools) */
const NAME_EM: Record<string, { is: number; en: number }> = { asvellir: { is: 5.55, en: 5.55 }, bolholt: { is: 5.1, en: 5.1 }, fossvogsvegur: { is: 9.36, en: 9.36 }, asparlaut: { is: 8.09, en: 8.57 } }
const TILE: Record<string, string> = { asvellir: 'sea', bolholt: 'green', fossvogsvegur: 'urban', asparlaut: 'rare' }

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
  const link = (id: PageId, cls = '') => `<a${cls ? ` class="${cls}"` : ''} href="${hrefOf(id, lang)}">${esc(id === 'home' ? t.home : id === 'about' ? t.about : id === 'contact' ? t.contact : id === 'my' ? t.myHome : t.overview)}</a>`
  return `<div class="drawer" aria-hidden="true">
    <div class="drawer__scrim"></div>
    <button class="drawer__close" type="button" aria-label="${esc(t.menuClose)}" hidden>
      <span class="drawer__close-label">${esc(t.menuCloseLabel)}</span>
      <svg viewBox="0 0 23 12" aria-hidden="true"><rect class="bar-long" width="23" height="3"/><rect class="bar-short" y="9" width="10" height="3"/></svg>
    </button>
    <div class="drawer__panel" role="dialog" aria-modal="true" aria-label="${esc(t.nav)}">
      <nav class="drawer__links" aria-label="${esc(t.navPrimary)}">
        ${link('home')}
        ${link('about')}
        ${link('contact')}
        ${link('my', 'drawer__links--minor')}
        ${link('overview', 'drawer__links--minor')}
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
/* A plain scrolling page (the reference's home is one screen with a marquee): who BYGG is, what is for sale with the
   published price, sizes and sellers, how registering works, who to call. Everything a buyer needs is in the HTML. */
function home(lang: Lang) {
  const t = T[lang]
  const lowest = Math.min(...Object.values(FROM_PRICE))
  const heroAlt = lang === 'is' ? 'Tölvuteiknuð mynd: Ásvellir 3-19, hús við leiksvæði' : 'Computer-generated image: Ásvellir 3-19, buildings by a playground'
  const sellersOf = (k: string) => SALE_PROJECTS.filter((p) => (p.sellers as readonly string[]).includes(k))
  const prefill = (project: string) => esc(JSON.stringify({ project }))
  const enquire = hrefOf('contact', lang)
  const fact = (value: string, label: string) => `<div class="home-facts__item"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`
  const card = (c: Collection) => {
    const sp = SALE_PROJECTS.find((p) => p.key === c.key)!
    const from = Math.min(...c.bands.map((b) => b.from)), to = Math.max(...c.bands.map((b) => b.to))
    return `<article class="pcard" style="--tile: var(--c-${TILE[c.key]})">
              <a class="pcard__img" href="${hrefOf(c.key, lang)}" tabindex="-1" aria-hidden="true"><img ${src(c.cover, '(max-width: 650px) 92vw, (max-width: 1024px) 45vw, 44vw', ` alt="" decoding="async" width="1920" height="1280"`)}></a>
              <div class="pcard__body">
                <div class="pcard__head">
                  <h3 class="pcard__name"><a class="pcard__link" href="${hrefOf(c.key, lang)}">${esc(sp.label)}</a></h3>
                  <p class="pcard__town">${esc(pick(sp.town, lang))}</p>
                </div>
                <dl class="pcard__meta">
                  <div><dt>${esc(t.cardPrice)}</dt><dd>${esc(mkr(FROM_PRICE[c.key], lang))}</dd></div>
                  <div><dt>${esc(t.cardSizes)}</dt><dd>${from}-${to}${NB}m²</dd></div>
                  <div><dt>${esc(t.cardSellers)}</dt><dd>${sp.sellers.length}</dd></div>
                </dl>
                <p class="pcard__go"><span class="pcard__view">${esc(t.cardView)} <img src="${brand('arrow-white.svg')}" alt="" width="17" height="15"></span><a class="pcard__enquire" href="${enquire}" data-prefill='${prefill(c.key)}'>${esc(t.cardEnquire)}</a></p>
              </div>
            </article>`
  }
  const more = SALE_PROJECTS.filter((p) => !p.page).map((p) => `<li class="more__row">
              <span class="more__name">${esc(p.label)}</span>
              <span class="more__town">${esc(pick(p.town, lang))}</span>
              <span class="more__sellers">${p.sellers.length}${NB}${esc(t.moreSellers)}</span>
              <span class="more__links"><a href="${enquire}" data-prefill='${prefill(p.key)}'>${esc(t.cardEnquire)}</a><a href="${p.url}" target="_blank" rel="noopener noreferrer">${esc(t.moreView)} <span aria-hidden="true">↗</span></a></span>
            </li>`).join('\n            ')
  const agencies = (Object.keys(AGENCY) as Array<keyof typeof AGENCY>)
    .sort((x, y) => sellersOf(y).length - sellersOf(x).length)
    .map((k) => `<tr>
                <th scope="row">${esc(AGENCY[k].name)}</th>
                <td><a href="tel:+354${AGENCY[k].phone.replace(/\s/g, '')}">${esc(AGENCY[k].phone)}</a></td>
                <td>${sellersOf(k).map((p) => esc(p.label)).join(', ')}</td>
              </tr>`).join('\n              ')
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
                <a class="btn" href="#verkefni" data-scroll>${esc(t.homeCtaSale)} <span aria-hidden="true">↓</span></a>
              </p>
            </div>
            <figure class="hero__photo home-hero__photo">
              <picture>
                <img ${src('hero', '(max-width: 650px) 92vw, (max-width: 1024px) 90vw, 46vw')} alt="${esc(heroAlt)}" width="1080" height="840" fetchpriority="high" decoding="async">
              </picture>
            </figure>
          </div>
          <dl class="home-facts" aria-label="${esc(t.factsAria)}" data-intro-fade>
            ${fact(String(SALE_PROJECTS.length), t.factProjects)}
            ${fact(String(Object.keys(AGENCY).length), t.factSellers)}
            ${fact(mkr(lowest, lang), t.factPrice)}
            ${fact('1984', t.factFounded)}
          </dl>
        </section>

        <section class="home-sec" id="verkefni" tabindex="-1" aria-labelledby="sale-title">
          <header class="home-sec__head" data-reveal>
            <h2 class="home-sec__title" id="sale-title">${esc(t.saleTitle)}</h2>
            <p class="home-sec__text">${esc(t.saleText)}</p>
          </header>
          <div class="pgrid" data-reveal>
            ${COLLECTIONS.map(card).join('\n            ')}
          </div>
          <div class="more" data-reveal>
            <h3 class="more__title">${esc(t.moreTitle)}</h3>
            <p class="more__text">${esc(t.moreText)}</p>
            <ul class="more__list">
            ${more}
            </ul>
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

        <section class="home-sec" aria-labelledby="ag-title">
          <header class="home-sec__head" data-reveal>
            <h2 class="home-sec__title" id="ag-title">${esc(t.agTitle)}</h2>
            <p class="home-sec__text">${esc(t.agText)}</p>
          </header>
          <div class="agtable" data-reveal>
            <table>
              <thead><tr><th scope="col">${esc(t.agName)}</th><th scope="col">${esc(t.agPhone)}</th><th scope="col">${esc(t.agProjects)}</th></tr></thead>
              <tbody>
              ${agencies}
              </tbody>
            </table>
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
              <p class="end__hours">${esc(t.hoursText)}</p>
              <p class="home-hero__cta"><a class="btn btn--solid" href="${enquire}">${esc(t.homeCtaEnquire)}</a></p>
            </div>
            <ul class="need">
              ${need(t.needRental, `${t.needRentalText}`, `<a class="need__go" href="${enquire}" data-prefill='${esc(JSON.stringify({ tab: 'partners' }))}'>${esc(t.needRentalGo)} <img src="${brand('arrow.svg')}" alt="" width="17" height="15"></a>`)}
              ${need(t.needService, t.needServiceText, `<a class="need__go" href="${hrefOf('my', lang)}">${esc(t.needServiceGo)} <img src="${brand('arrow.svg')}" alt="" width="17" height="15"></a>`)}
              ${need(t.needFinance, t.needFinanceText, `<a class="need__go" href="${HMS_URL}" target="_blank" rel="noopener noreferrer">${esc(t.needFinanceGo)} <span aria-hidden="true">↗</span></a>`)}
            </ul>
          </div>
        </section>

        <footer class="colophon home-colophon"><small>${esc(t.colophon)}</small>${credit(t)}</footer>
      </main>
    </div>`
}

/* ---------------------------------------------------------------- collections */
const sizeOption = (to: number) => (to <= 80 ? 0 : to <= 100 ? 1 : to <= 130 ? 2 : 3)

function ledger(c: Collection, lang: Lang) {
  const t = T[lang]
  const opts = t.optSize.split('|')
  const sellers = SALE_PROJECTS.find((p) => p.key === c.key)!
  const rows = c.bands
    .map((b) => {
      const pf = JSON.stringify({ project: c.key, size: opts[sizeOption(b.to)] })
      return `            <div class="ledger__row">
              <span class="ledger__size">${b.from}-${b.to}${NB}m²<small>${esc(t.ledgerSizeUnit)}</small></span>
              <span class="ledger__price"><b>${esc(mkr(b.price, lang))}</b></span>
              <span class="ledger__stat"><span class="ledger__bar" aria-hidden="true"><i style="--w:${b.w}"></i></span><span class="ledger__tag">${esc(t.ledgerSample)}</span></span>
              <span class="ledger__go"><a href="${hrefOf('contact', lang)}" data-route="${hrefOf('contact', lang)}" data-prefill='${esc(pf)}'>${esc(t.ledgerGo)} <img src="${brand('arrow.svg')}" alt="" width="17" height="15"></a></span>
            </div>`
    })
    .join('\n')
  return `        <section class="ledger" aria-labelledby="ledger-${c.key}">
          <header class="intro">
            <span class="intro__rule" aria-hidden="true"></span>
            <h2 class="intro__title" id="ledger-${c.key}">${esc(pick(c.ledgerTitle, lang))}</h2>
            <p class="intro__text">${esc(t.ledgerNote)}</p>
          </header>
          <div class="ledger__table">
            <div class="ledger__head" aria-hidden="true"><span>${esc(t.ledgerHeadSize)}</span><span>${esc(t.ledgerHeadPrice)}</span><span>${esc(t.ledgerHeadStat)}</span><span></span></div>
${rows}
            <p class="ledger__sellers"><b>${esc(t.sellersLabel)}:</b> <span>${sellers.sellers.map((k) => `${esc(AGENCY[k].name)} ${esc(AGENCY[k].phone)}`).join(', ')}. ${esc(t.sellersTail)}</span></p>
            <p class="ledger__note"><a href="${sellers.url}" target="_blank" rel="noopener noreferrer">${esc(sellers.label)} ${lang === 'is' ? 'á bygg.is' : 'on bygg.is'}</a><br><a href="https://www.bygg.is/verkefni/" target="_blank" rel="noopener noreferrer">${esc(t.ledgerLinkMore)}</a><br><a href="${HMS_URL}" target="_blank" rel="noopener noreferrer">${esc(t.ledgerLinkHms)}</a></p>
          </div>
        </section>`
}

function collection(c: Collection, lang: Lang) {
  const t = T[lang]
  const i = COLLECTIONS.findIndex((x) => x.key === c.key)
  const nx = COLLECTIONS[(i + 1) % COLLECTIONS.length]
  const price = mkr(FROM_PRICE[c.key], lang)
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
  return `<div class="page" data-view="category" data-category="${c.key}">
      <main class="page__main" id="main" tabindex="-1">
        <div class="scene">
          <section class="frame" aria-labelledby="page-title">
            ${masthead(lang, t, 'white')}

            <div class="hero hero--category">
              <div class="hero__stack">
                <figure class="hero__photo"><img ${src(c.hero, '20vw', ` alt="${alt(c.heroAlt)}" fetchpriority="high" decoding="sync"`)}></figure>
                ${ticker(pick(c.marquee, lang))}
              </div>
              <div class="hero__copy">
                <h1 id="page-title" class="hero__lead">${esc(pick(c.lead, lang))}</h1>
                <p class="chip">${esc(`${t.fromWord} ${price}`)}</p>
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
            <figcaption class="quote__credit">
              <p class="quote__name">BYGG</p>
              <p class="quote__source">/ ${esc(pick(c.name, lang))} / ${lang === 'is' ? 'verkefnislýsing' : 'project description'}</p>
            </figcaption>
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
              <p class="quote__name">BYGG</p>
              <p class="quote__source">/ ${esc(pick(c.name, lang))} / ${lang === 'is' ? 'verkefnislýsing' : 'project description'}</p>
            </figcaption>
          </figure>
` : ''}        </section>

${photoBreak(c.breaks[1], pick(c.labels[1], lang))}

        <section class="cta">
          <div class="cta__inner">
            <span class="cta__rule" aria-hidden="true"></span>
            <h2 class="cta__title">${esc(pick(c.cta, lang))}</h2>
            <h4 class="cta__link"><a class="cta__underline" href="${hrefOf('contact', lang)}" data-route="${hrefOf('contact', lang)}" data-prefill='${esc(JSON.stringify({ project: c.key }))}'>${esc(t.ctaLink)} <img src="${brand('arrow.svg')}" alt="" width="17" height="15"></a></h4>
          </div>
        </section>

        ${nextBlock(nx, lang)}
      </main>
    </div>`
}

const nextBlock = (nx: Collection, lang: Lang) => {
  const t = T[lang]
  return `<section class="next" aria-label="${esc(`${lang === 'is' ? 'Næsta verkefni' : 'Next project'}: ${pick(nx.name, lang)}`)}">
          <div class="next__window"><div class="next__zoom"><div class="next__drift"><img ${src(nx.nextImg, '100vw', ' alt="" loading="lazy" decoding="async"')}></div></div></div>
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
  const hist = HISTORY.map((h) => {
    const e = lang === 'is' ? h : { ...h, ...HISTORY_EN[h.year] }
    return `            <li class="chronicle__item"><span class="chronicle__year">${h.year}</span><div><h3 class="chronicle__title">${esc(e.title)}</h3><p class="chronicle__text">${esc(e.text)}</p></div></li>`
  }).join('\n')
  const people = PEOPLE.map((p) => `            <li class="people__item"><b>${esc(p.name)}</b><span>${esc(pick(p.role, lang))}</span></li>`).join('\n')
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
            <img class="backdrop__image" ${src('ab-sjaland', '100vw', ' alt="" fetchpriority="high" decoding="sync"')}>
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
                <figure class="film__still-wrap"><img class="film__still" ${src('ab-founders', '(max-width: 650px) 90vw, 30vw', ` alt="${esc(t.aboutFilmAlt)}" decoding="async"`)}></figure>
              </div>
            </div>
            <p class="film__link"><a href="https://www.bygg.is/um-okkur/" target="_blank" rel="noopener noreferrer">${esc(t.aboutFilmLink)}</a></p>
          </section>
          <section class="film__runway" aria-hidden="true"></section>
        </div>

        <section class="outro outro--about">
          <figure class="quote">
            <img class="quote__image" ${src('ab-founders', '13vw', ` alt="${esc(t.aboutQuoteAlt)}" loading="lazy" decoding="async"`)}>
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
${hist}
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
          <div class="photo-break__window"><img ${src('ab-lundur', '100vw', ` alt="${esc(lang === 'is' ? 'Ljósmynd úr lofti: Lundur í Kópavogi' : 'Aerial photograph: Lundur in Kópavogur')}" loading="lazy" decoding="async"`)}></div>
        </section>

        <section class="cta">
          <div class="cta__inner">
            <span class="cta__rule" aria-hidden="true"></span>
            <h2 class="cta__title">${esc(t.aboutCta)}</h2>
            <h4 class="cta__link"><a class="cta__underline" href="${hrefOf('asvellir', lang)}" data-route="${hrefOf('asvellir', lang)}">${esc(t.aboutCtaLink)} <img src="${brand('arrow.svg')}" alt="" width="17" height="15"></a></h4>
          </div>
        </section>

        ${nextBlock(a1, lang)}
      </main>
    </div>`
}

/* ---------------------------------------------------------------- desk pages (contact, my home, 404) */
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
const opt = (list: string, valueless = false) => list.split('|').map((o) => `<option value="${valueless ? '' : esc(o)}">${esc(o)}</option>`).join('')
const select = (id: string, name: string, ph: string, options: string, required = true, extra = '') => `<div class="field"><label class="sr-only" for="${id}">${esc(ph.replace(/\*$/, ''))}</label><select id="${id}" name="${name}"${required ? ' required' : ''}${extra}><option value="" disabled selected>${esc(ph)}</option>${options}</select></div>`
const input = (id: string, type: string, name: string, ph: string, required = true, extra = '') => `<div class="field"><label class="sr-only" for="${id}">${esc(ph.replace(/\*$/, ''))}</label><input${type === 'email' ? ' spellcheck="false"' : ''} type="${type}" id="${id}" name="${name}" placeholder="${esc(ph)}"${required ? ' required' : ''}${extra}></div>`
const textarea = (id: string, ph: string, required = false) => `<div class="field"><label class="sr-only" for="${id}">${esc(ph.replace(/\*$/, ''))}</label><textarea id="${id}" name="message" rows="2" placeholder="${esc(ph)}"${required ? ' required' : ''}></textarea></div>`
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
  const projects = SALE_PROJECTS.map((p) => `<option value="${p.key}">${esc(p.label)}, ${esc(pick(p.town, lang))}</option>`).join('')
  const buyer = rows([
    input('inv-name', 'text', 'fullname', t.fName, true, ' autocomplete="name"'),
    input('inv-email', 'email', 'email', t.fEmail, true, ' autocomplete="email"'),
    `<div class="field-row">${input('inv-phone', 'tel', 'phone', t.fPhone, true, ' autocomplete="tel"')}${select('inv-country', 'country', t.fCountry, '', true, ' autocomplete="country-name" data-countries')}</div>`,
    `<div class="field-row">${select('inv-project', 'project', t.fProject, projects)}${select('inv-rooms', 'rooms', t.fRooms, opt(t.optRooms), false)}</div>`,
    `<div class="field-row">${select('inv-size', 'size', t.fSize, opt(t.optSize), false)}${select('inv-budget', 'budget', t.fBudget, opt(t.optBudget), false)}</div>`,
    `<div class="field-row">${select('inv-first', 'first', t.fFirst, opt(t.optFirst), false)}${select('inv-finance', 'finance', t.fFinance, opt(t.optFinance), false)}</div>`,
    select('inv-viewing', 'viewing', t.fViewing, opt(t.optViewing), false),
    textarea('inv-message', t.fMessage),
    `<p class="enquiry__hint">${esc(t.hintFinance)} <a href="${HMS_URL}" target="_blank" rel="noopener noreferrer">${esc(t.hintFinanceLink)}</a></p>`,
    consent('inv-consent', t), foot(t.send),
  ])
  const props = RENTALS.map((r) => `<option value="${r.key}">${esc(r.label)}, ${esc(pick(r.note, lang))}</option>`).join('')
  const tenant = rows([
    input('par-name', 'text', 'fullname', t.fName, true, ' autocomplete="name"'),
    input('par-email', 'email', 'email', t.fEmail, true, ' autocomplete="email"'),
    `<div class="field-row">${input('par-phone', 'tel', 'phone', t.fPhone, true, ' autocomplete="tel"')}${select('par-country', 'country', t.fCountry, '', true, ' autocomplete="country-name" data-countries')}</div>`,
    `<div class="field-row">${input('par-company', 'text', 'company', t.fCompany, true, ' autocomplete="organization"')}${select('par-property', 'property', t.fProperty, props)}</div>`,
    input('par-area', 'text', 'area', t.fArea, false, ' inputmode="numeric"'),
    textarea('par-message', t.fMessage),
    consent('par-consent', t), foot(t.send),
  ])
  return deskPage('contact', lang, {
    current: 'contact', word: t.contactWord, h1: t.contactH1, heading: t.contactHeading,
    channels: [
      channel(t.chOffice, `<a class="channel__value" href="${PHONE.href}">${esc(PHONE.display)}</a>`),
      channel(t.chRental, copyBtn(RENTAL_MAIL, t)),
      channel(t.chService, `<a class="channel__value" href="mailto:${SERVICE_MAIL}">${SERVICE_MAIL}</a>`),
      channel(t.chHours, `<span class="channel__value channel__plain" style="cursor:default">${esc(t.hoursText)}</span>`),
    ].join('\n'),
    aside: `              <div class="enquiry">
                <div class="enquiry__tabs" role="tablist" aria-label="${esc(t.tabsAria)}">
                  <button type="button" class="enquiry__tab is-active" role="tab" id="tab-investors" aria-selected="true" aria-controls="enquiry-investors" data-tab="investors">${esc(t.tabBuyer)}</button>
                  <button type="button" class="enquiry__tab" role="tab" id="tab-partners" aria-selected="false" aria-controls="enquiry-partners" data-tab="partners" tabindex="-1">${esc(t.tabTenant)}</button>
                </div>
                <div class="enquiry__panels">
                <form class="enquiry__form is-active" id="enquiry-investors" data-kind="buyer" novalidate role="tabpanel" aria-labelledby="tab-investors">
${buyer}
                </form>
                <form class="enquiry__form" id="enquiry-partners" data-kind="tenant" novalidate hidden inert role="tabpanel" aria-labelledby="tab-partners">
${tenant}
                </form>
                </div>
                <p class="enquiry__error" hidden>${esc(t.formError)}</p>
                <p class="enquiry__sample">${esc(t.sampleForm)}</p>
              </div>`,
  })
}

function myHome(lang: Lang) {
  const t = T[lang]
  const projects = SALE_PROJECTS.map((p) => `<option value="${p.key}">${esc(p.label)}</option>`).join('')
  const ticks = `<ul class="ticks">${t.tickHandover.split('|').map((x, i) => `<li><label><input type="checkbox" name="tick${i}" value="1"><span>${esc(x)}</span></label></li>`).join('')}</ul>`
  const handover = rows([
    `<p class="enquiry__hint">${esc(t.hHandover)}</p>`,
    select('inv-project', 'project', lang === 'is' ? 'Verkefni*' : 'Project*', projects),
    input('inv-unit', 'text', 'unit', t.fUnit, true, ' autocomplete="off"'),
    ticks, foot(t.sendList),
  ])
  const defect = rows([
    `<p class="enquiry__hint">${esc(t.hDefect)}</p>`,
    `<div class="field-row">${select('par-project', 'project', lang === 'is' ? 'Verkefni*' : 'Project*', projects)}${input('par-unit', 'text', 'unit', t.fUnit, true, ' autocomplete="off"')}</div>`,
    select('par-room', 'room', t.fRoom, opt(t.optRoom), false),
    textarea('par-defect', t.fDefect, true),
    `<div class="field"><label class="sr-only" for="par-photo">${esc(t.fPhoto)}</label><input type="file" id="par-photo" name="photo" accept="image/*" multiple aria-label="${esc(t.fPhoto)}"></div>`,
    input('par-phone', 'tel', 'phone', t.fPhone, true, ' autocomplete="tel"'),
    consent('par-consent', t), foot(t.sendDefect),
  ])
  return deskPage('my', lang, {
    current: null, word: t.myWord, h1: t.myH1, heading: t.myHeading,
    channels: [
      channel(t.chService, copyBtn(SERVICE_MAIL, t)),
      channel(t.chOffice, `<a class="channel__value" href="${PHONE.href}">${esc(PHONE.display)}</a>`),
      channel(t.chHours, `<span class="channel__value channel__plain" style="cursor:default">${esc(t.hoursText)}</span>`),
    ].join('\n'),
    aside: `              <div class="enquiry">
                <div class="enquiry__tabs" role="tablist" aria-label="${esc(t.tabsAria)}">
                  <button type="button" class="enquiry__tab is-active" role="tab" id="tab-investors" aria-selected="true" aria-controls="enquiry-investors" data-tab="investors">${esc(t.tabHandover)}</button>
                  <button type="button" class="enquiry__tab" role="tab" id="tab-partners" aria-selected="false" aria-controls="enquiry-partners" data-tab="partners" tabindex="-1">${esc(t.tabDefect)}</button>
                </div>
                <div class="enquiry__panels">
                <form class="enquiry__form is-active" id="enquiry-investors" data-kind="handover" novalidate role="tabpanel" aria-labelledby="tab-investors">
${handover}
                </form>
                <form class="enquiry__form" id="enquiry-partners" data-kind="defect" novalidate hidden inert role="tabpanel" aria-labelledby="tab-partners">
${defect}
                </form>
                </div>
                <p class="enquiry__error" hidden>${esc(t.formError)}</p>
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

/* ---------------------------------------------------------------- sales overview (sample data) */
function overview(lang: Lang) {
  const t = T[lang]
  const a1 = COLLECTIONS[0]
  const max = Math.max(...SAMPLE.demand.flatMap((d) => d.bands.map((b) => b.n)))
  const tag = `<span class="tag-sample">${esc(t.ovNoticeTag)}</span>`
  const demand = SAMPLE.demand.map((d) => {
    const c = collectionOf(d.project)!
    const total = d.bands.reduce((a, b) => a + b.n, 0)
    return `              <div class="demand__row">
                <div class="demand__name">${esc(pick(c.name, lang))}<small>${esc(pick(c.town, lang))}</small></div>
                <div class="demand__bars">${d.bands.map((b) => `<div class="demand__bar"><em style="font-style:normal">${esc(pick(b.l, lang))} · ${b.n}</em><span><i style="--w:${(b.n / max).toFixed(3)}"></i></span></div>`).join('')}</div>
                <div class="demand__total">${total}</div>
              </div>`
  }).join('\n')
  const funnel = SAMPLE.funnel.map((f, n) => `              <div class="funnel__step${n === SAMPLE.stall ? ' funnel__step--stall' : ''}"><span class="funnel__n">${f.n}</span><span class="funnel__l">${esc(pick(f.l, lang))}</span><span class="funnel__d">${esc(pick(f.d, lang))}</span></div>`).join('\n')
  const sellers = SAMPLE.sellers.map((s) => `              <div class="sellers__row${s.hours > 24 ? ' sellers__row--slow' : ''}"><span class="sellers__name">${esc(pick(s.name, lang))}</span><span class="sellers__num">${s.sent}</span><span class="sellers__num sellers__num--slow">${String(s.hours).replace('.', lang === 'is' ? ',' : '.')}${NB}${esc(t.hoursShort)}</span><span class="sellers__num">${s.viewings}%</span></div>`).join('\n')
  return `<div class="page" data-view="about" data-slug="overview">
      <main class="page__main" id="main" tabindex="-1">
        <div class="scene scene--about">
          <div class="backdrop" aria-hidden="true">
            <img class="backdrop__image" ${src('board-bg', '100vw', ' alt="" fetchpriority="high" decoding="sync"')}>
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
            <h2 class="board__title">${esc(t.ovDemandTitle)}<small>${esc(t.ovDemandSub)} ${tag}</small></h2>
            <div class="board__body">
${demand}
            </div>
          </div>
          <div class="board__block">
            <h2 class="board__title">${esc(t.ovFunnelTitle)}<small>${esc(t.ovFunnelSub)} ${tag}</small></h2>
            <div class="board__body">
              <div class="funnel">
${funnel}
              </div>
              <p class="funnel__note">${esc(t.ovFunnelNote)}</p>
            </div>
          </div>
          <div class="board__block">
            <h2 class="board__title">${esc(t.ovSellersTitle)}<small>${esc(t.ovSellersSub)} ${tag}</small></h2>
            <div class="board__body">
              <div class="sellers">
                <div class="sellers__head"><span>${esc(t.ovSellerCol1)}</span><span>${esc(t.ovSellerCol2)}</span><span>${esc(t.ovSellerCol3)}</span><span>${esc(t.ovSellerCol4)}</span></div>
${sellers}
              </div>
            </div>
          </div>
        </section>

        <section class="photo-break" aria-label="${esc(t.ovBreak)}">
          <div class="photo-break__window"><img ${src('ab-stilla', '100vw', ` alt="${esc(lang === 'is' ? 'Ljósmynd úr lofti af byggingarsvæði BYGG' : "Aerial photograph of a BYGG building site")}" loading="lazy" decoding="async"`)}></div>
        </section>

        <section class="cta">
          <div class="cta__inner">
            <span class="cta__rule" aria-hidden="true"></span>
            <h2 class="cta__title">${esc(t.ovCta)}</h2>
            <h4 class="cta__link"><a class="cta__underline" href="${hrefOf('contact', lang)}" data-route="${hrefOf('contact', lang)}">${esc(t.ovCtaLink)} <img src="${brand('arrow.svg')}" alt="" width="17" height="15"></a></h4>
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
  else if (c) { pageHtml = collection(c, lang); title = `${pick(c.name, lang)} | BYGG`; description = pick(c.description, lang); heroes.push(img(c.hero)); theme = '#000000' }
  else if (id === 'about') { pageHtml = about(lang); title = t.aboutTitle; description = t.aboutDesc; heroes.push(img('ab-sjaland')) }
  else if (id === 'contact') { pageHtml = contact(lang); title = t.contactTitle; description = t.contactDesc }
  else if (id === 'my') { pageHtml = myHome(lang); title = t.myTitle; description = t.myDesc }
  else if (id === 'overview') { pageHtml = overview(lang); title = t.ovTitle; description = t.ovDesc; heroes.push(img('board-bg')) }
  else { pageHtml = notFound(lang); title = t.notFoundTitle; description = t.notFoundDesc }
  const html = `<!doctype html><html lang="${lang}"><head><title>${esc(title)}</title></head><body data-page="${VIEW[id]}"${c ? ` data-category="${c.key}"` : ''}>${pageHtml}</body></html>`
  return { title, description, pageHtml, html, view: VIEW[id], category: c ? c.key : '', heroes, theme }
}
