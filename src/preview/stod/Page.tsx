import { useLayoutEffect, useMemo, useRef } from 'react'
import { PreviewChrome } from '../PreviewChrome'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { stodCss } from './styles'
import { mountStod, type EngineConfig } from './motion'
import { MAIL, QUOTE_PHONE, T, brand, companyEntry, estimate, type Lang } from './data'
import { basePath, idOfKey, renderPage, renderShell, routeList } from './pages'

/* /preview/stod (Icelandic) and /preview/stod/en.
   The BYGG build's motion engine (motion.ts, the Realevate clean-room rebuild) running on STOÐ's own markup (pages.ts):
   the React route only mounts it, hands it the copy and tears it down again. The engine owns everything inside
   `.bg-root`; React renders nothing there, so a re-render never touches it. Two STOÐ additions live here: the live
   price line in the rental form, and the request summary the thank-you card shows. */

const B = import.meta.env.BASE_URL
const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function langOf(pathname: string): Lang {
  return /\/preview\/stod\/en(\/|$)/.test(pathname) ? 'en' : 'is'
}
function keyFromPath(pathname: string, lang: Lang): string {
  const rest = pathname.slice(basePath(lang).length).replace(/\/+$/, '')
  return rest || '/'
}

/* Organisation facts as pallaleiga.is and 1819.is publish them */
const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'STOÐ pallaleiga ehf.',
  url: 'https://www.pallaleiga.is/',
  telephone: '+354 571 0600',
  email: 'pallaleiga@pallaleiga.is',
  foundingDate: '2009-06',
  address: { '@type': 'PostalAddress', streetAddress: 'Tunguháls 17', postalCode: '110', addressLocality: 'Reykjavík', addressCountry: 'IS' },
  openingHours: ['Mo-Fr 08:00-12:00', 'Mo-Fr 13:00-17:00'],
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** the label a select shows for its value, or the raw value of any other field */
function shown(form: HTMLFormElement, name: string): string {
  const el = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null
  if (!el) return ''
  if (el instanceof HTMLSelectElement) return el.value ? el.selectedOptions[0]?.textContent?.trim() ?? '' : ''
  if (el.type === 'file') {
    const n = (el as HTMLInputElement).files?.length ?? 0
    return n ? String(n) : ''
  }
  return el.value.trim()
}
const dateText = (v: string, lang: Lang) => {
  if (!v) return ''
  const d = new Date(`${v}T12:00:00`)
  if (Number.isNaN(d.getTime())) return v
  const months = lang === 'is'
    ? ['janúar', 'febrúar', 'mars', 'apríl', 'maí', 'júní', 'júlí', 'ágúst', 'september', 'október', 'nóvember', 'desember']
    : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return lang === 'is' ? `${d.getDate()}. ${months[d.getMonth()]}` : `${d.getDate()} ${months[d.getMonth()]}`
}

export default function StodPage() {
  /* window.location, not the router's: the router's pathname is relative to the deploy base */
  const pathname = window.location.pathname
  const rootRef = useRef<HTMLDivElement>(null)
  /* the language and first page are read once: after that the engine's own router owns the address bar */
  const first = useRef<{ lang: Lang; key: string } | null>(null)
  if (!first.current) {
    const lang = langOf(pathname)
    first.current = { lang, key: keyFromPath(pathname, lang) }
  }
  const { lang, key } = first.current
  const css = useMemo(() => stodCss(B), [])

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const t = T[lang]
    const routes = routeList(lang)
    const id = idOfKey(key, lang)
    const start = renderPage(id, lang)

    const html = document.documentElement
    const prev = { title: document.title, lang: html.lang }
    html.classList.add('bg-on')
    html.lang = t.htmlLang
    document.title = start.title
    setThemeColor(start.theme)
    let offDesc = setMetaDescription(start.description)
    document.body.dataset.page = start.view
    if (start.category) document.body.dataset.category = start.category
    if (id === 'home' && !prefersReduced()) html.classList.add('is-cold')
    root.innerHTML = renderShell(id, lang)

    /* the rental form's price line: product + working height (+ quantity for props) -> the published price */
    const updateEstimate = (form: HTMLFormElement) => {
      const out = form.querySelector<HTMLElement>('[data-estimate]')
      if (!out) return
      const product = (form.elements.namedItem('product') as HTMLSelectElement | null)?.value ?? ''
      const height = Number((form.elements.namedItem('height') as HTMLSelectElement | null)?.value || -1)
      const qty = Number((form.elements.namedItem('qty') as HTMLInputElement | null)?.value || 1)
      const heightSel = form.elements.namedItem('height') as HTMLSelectElement | null
      /* the folding tower has one working height; a fixed tower needs one chosen */
      if (heightSel) heightSel.closest('.field')?.toggleAttribute('data-off', !(product.startsWith('tower') || product === '' || product === 'unsure'))
      if (product === 'tower-folding' && heightSel && heightSel.value !== '0') heightSel.value = '0'
      if (!product) { out.textContent = t.hintRental; return }
      if ((product === 'tower-single' || product === 'tower-double') && !(height >= 1 && height <= 8)) {
        out.innerHTML = `${esc(lang === 'is' ? 'Veldu vinnuhæð og verðið birtist.' : 'Choose a working height and the price appears.')}`
        return
      }
      const e = estimate(product, height, qty, lang)
      out.innerHTML = e ? `${esc(t.estimateLabel)} <b>${esc(e)}</b>. ${esc(lang === 'is' ? 'Starfsfólk staðfestir verð og framboð.' : 'Staff confirm price and availability.')}` : esc(t.estimateNone)
    }
    const onField = (ev: Event) => {
      const form = (ev.target as HTMLElement | null)?.closest?.('form[data-kind="rental"]') as HTMLFormElement | null
      if (form) updateEstimate(form)
    }
    /* after a sent request the engine resets the form: the price line goes back to its hint */
    const onReset = (ev: Event) => {
      const form = ev.target as HTMLFormElement | null
      if (form?.dataset?.kind === 'rental') setTimeout(() => updateEstimate(form), 0)
    }
    root.addEventListener('change', onField)
    root.addEventListener('input', onField)
    root.addEventListener('reset', onReset, true)

    const cfg: EngineConfig = {
      base: basePath(lang),
      routes,
      lang,
      t,
      render: (k) => {
        const r = renderPage(idOfKey(k, lang), lang)
        return { title: r.title, description: r.description, theme: r.theme, html: r.html, view: r.view, category: r.category, heroes: r.heroes }
      },
      onCommit: (d) => {
        offDesc()
        offDesc = setMetaDescription(d.description)
        setThemeColor(d.theme)
      },
      countries: { codes: [], excluded: [], dial: {}, example: {}, first: 'IS' },
      policyHtml: t.policy,
      arrow: brand('arrow.svg'),
      fontProbe: '500 1em "Stod Sans"',
      /* read before the engine resets the form: what STOÐ staff would receive */
      flow: (form) => {
        const is = lang === 'is'
        const line = (label: string, value: string) => (value ? `${label}: ${value}` : '')
        const contact = [shown(form, 'fullname'), shown(form, 'phone'), shown(form, 'email')].filter(Boolean).join(', ')
        if (form.dataset.kind === 'rental') {
          const product = shown(form, 'product')
          const height = (form.elements.namedItem('height') as HTMLSelectElement | null)?.value
          const e = estimate((form.elements.namedItem('product') as HTMLSelectElement).value, Number(height || -1), Number(shown(form, 'qty') || 1), lang)
          const list = [
            line(is ? 'Leiga' : 'Hire', [product, shown(form, 'qty') ? `× ${shown(form, 'qty')}` : ''].filter(Boolean).join(' ')),
            line(is ? 'Vinnuhæð' : 'Working height', shown(form, 'height')),
            line(is ? 'Tími' : 'When', [dateText(shown(form, 'from'), lang), shown(form, 'period').toLowerCase()].filter(Boolean).join(', ')),
            line(is ? 'Afhending' : 'Handover', shown(form, 'pickup')),
            line(is ? 'Verkstaður' : 'Site', shown(form, 'place')),
            line(is ? 'Verð af verðskrá' : 'Price list', e ?? ''),
            line(is ? 'Tengiliður' : 'Contact', contact),
            line(is ? 'Annað' : 'Note', shown(form, 'message')),
          ].filter(Boolean)
          return { title: t.thanksTitle, text: t.thanksRental, list, note: t.thanksNote }
        }
        const length = shown(form, 'length'), tall = shown(form, 'tall')
        const size = length || tall ? `${is ? 'um' : 'about'} ${length || '?'} × ${tall || '?'} m${is ? ' (áætlun)' : ' (estimate)'}` : (is ? 'ekki gefin upp' : 'not given')
        const photos = shown(form, 'photos')
        const list = [
          line(is ? 'Verk' : 'Job', shown(form, 'need')),
          line(is ? 'Uppsetning' : 'Set-up', shown(form, 'assembly')),
          line(is ? 'Verkstaður' : 'Site', shown(form, 'address')),
          line(is ? 'Lengd × hæð' : 'Length × height', size),
          line(is ? 'Verkið' : 'The work', shown(form, 'task')),
          line(is ? 'Tími' : 'When', [dateText(shown(form, 'start'), lang), shown(form, 'duration').toLowerCase()].filter(Boolean).join(', ')),
          line(is ? 'Myndir' : 'Photos', photos ? (is ? `${photos} myndir` : `${photos} photos`) : (is ? 'engar' : 'none')),
          line(is ? 'Tengiliður' : 'Contact', [contact, shown(form, 'company')].filter(Boolean).join(', ')),
          line(is ? 'Annað' : 'Note', shown(form, 'message')),
        ].filter(Boolean)
        return { title: t.thanksTitle, text: `${t.thanksJob}`, list, note: `${t.thanksNote} ${is ? `Tilboð: ${QUOTE_PHONE.name}, ${QUOTE_PHONE.display}, ${MAIL}.` : `Quotes: ${QUOTE_PHONE.name}, ${QUOTE_PHONE.display}, ${MAIL}.`}` }
      },
    }
    const destroy = mountStod(cfg)
    return () => {
      destroy()
      root.removeEventListener('change', onField)
      root.removeEventListener('input', onField)
      root.removeEventListener('reset', onReset, true)
      offDesc()
      root.innerHTML = ''
      html.classList.remove('bg-on')
      html.lang = prev.lang
      document.title = prev.title
    }
  }, [lang, key])

  return (
    <>
      <style>{css}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={companyEntry} />
      <div ref={rootRef} className="bg-root" lang={T[lang].htmlLang} />
    </>
  )
}
