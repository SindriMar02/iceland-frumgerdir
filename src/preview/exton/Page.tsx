import { useLayoutEffect, useMemo, useRef } from 'react'
import { setMetaDescription, setThemeColor } from '../../lib/preview'
import { extonCss } from './styles'
import { mountExton, type EngineConfig } from './motion'
import { T, brand, type Lang } from './data'
import { basePath, idOfKey, renderPage, renderShell, routeList, PAGE_IDS, hrefOf } from './pages'
import { installFocusGuard } from './focus-guard'
import './focus-guard.css'

const B = import.meta.env.BASE_URL
const shown = (form: HTMLFormElement, name: string) => {
  const el = form.elements.namedItem(name)
  if (el instanceof HTMLSelectElement) return el.selectedOptions[0]?.textContent?.trim() ?? ''
  if (el instanceof HTMLInputElement && el.value && (el.type === 'date' || el.type === 'datetime-local')) {
    const [d, tm] = el.value.split('T'), [y, m, day] = d.split('-').map(Number)
    const en = document.documentElement.lang === 'en' // fixed month names: some browsers ship no is-IS locale data
    const months = en ? ['January','February','March','April','May','June','July','August','September','October','November','December'] : ['janúar','febrúar','mars','apríl','maí','júní','júlí','ágúst','september','október','nóvember','desember']
    return `${day}${en ? '' : '.'} ${months[m - 1]} ${y}${tm ? (en ? ' at ' : ' kl. ') + tm.slice(0, 5) : ''}`
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) return el.value.trim()
  return ''
}
export default function ExtonPage() {
  const rootRef = useRef<HTMLDivElement>(null)
  const first = useRef<{ lang: Lang; key: string } | null>(null)
  if (!first.current) {
    const lang: Lang = /\/preview\/exton\/en(\/|$)/.test(window.location.pathname) ? 'en' : 'is'
    first.current = { lang, key: window.location.pathname.slice(basePath(lang).length).replace(/\/+$/, '') || '/' }
  }
  const { lang, key } = first.current
  const css = useMemo(() => extonCss(B), [])
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const t = T[lang], is = lang === 'is', html = document.documentElement
    const prev = { title: document.title, lang: html.lang, page: document.body.dataset.page, category: document.body.dataset.category }
    const id = idOfKey(key, lang), start = renderPage(id, lang)
    const offFocus = installFocusGuard()
    html.classList.add('bg-on', 'exton-on'); html.lang = lang
    document.title = start.title
    const oldTheme = document.querySelector('meta[name="theme-color"]')?.getAttribute('content') ?? '#ffffff'; setThemeColor(start.theme)
    let offDesc = setMetaDescription(start.description)
    const robots = document.createElement('meta'); robots.name = 'robots'; robots.content = 'noindex, nofollow'; document.head.appendChild(robots)
    document.body.dataset.page = start.view
    document.body.dataset.category = start.category
    if (id === 'home' && !matchMedia('(prefers-reduced-motion: reduce)').matches) html.classList.add('is-cold')
    root.innerHTML = renderShell(id, lang)
    const urls = new Set<string>()
    const releasePhotos = () => { urls.forEach(URL.revokeObjectURL); urls.clear() }
    let rowCounter = 0
    const click = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const add = target.closest<HTMLButtonElement>('[data-add-equipment]')
      if (add) {
        const form = add.closest('form')!, list = form.querySelector('[data-equipment-list]')!
        const row = list.querySelector<HTMLElement>('[data-equipment-row]')!.cloneNode(true) as HTMLElement
        rowCounter++
        row.querySelectorAll('.field-error,.equipment-remove').forEach(el=>el.remove())
        row.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input,select').forEach(el => {
          const old = el.id; el.id = `${old}-extra-${rowCounter}`
          row.querySelector(`label[for="${old}"]`)?.setAttribute('for', el.id)
          el.value = el.name === 'qty' ? '1' : ''
          el.removeAttribute('aria-invalid'); el.removeAttribute('aria-describedby')
        })
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'equipment-remove'; remove.dataset.removeEquipment = ''; remove.textContent = is ? 'Fjarlægja' : 'Remove'; row.appendChild(remove); list.appendChild(row)
        row.querySelector('select')?.focus({ preventScroll: true })
        if (!matchMedia('(prefers-reduced-motion: reduce)').matches) row.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'ease-out' })
      }
      const remove = target.closest('[data-remove-equipment]')
      if (remove) {
        const row = remove.closest<HTMLElement>('[data-equipment-row]')!, form = row.closest('form')!
        form.querySelector<HTMLButtonElement>('[data-add-equipment]')?.focus({ preventScroll: true })
        row.inert = true
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) row.remove()
        else row.animate([{ height: `${row.offsetHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 200, easing: 'ease-out' }).finished.then(() => row.remove()).catch(() => row.remove())
      }
      const toggle = target.closest<HTMLButtonElement>('[data-inbox-toggle]')
      if (toggle) {
        const panel = document.getElementById(toggle.getAttribute('aria-controls')!)!
        const opening = toggle.getAttribute('aria-expanded') !== 'true'
        const from = panel.hidden ? 0 : panel.getBoundingClientRect().height
        panel.getAnimations().forEach(a => a.cancel())
        toggle.setAttribute('aria-expanded', String(opening)); panel.hidden = false; panel.style.height = 'auto'
        const to = opening ? panel.scrollHeight : 0
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) { panel.hidden = !opening; return }
        const animation = panel.animate([{ height: `${from}px`, opacity: opening ? .3 : 1 }, { height: `${to}px`, opacity: opening ? 1 : 0 }], { duration: 320, easing: 'ease-out', fill: 'both' })
        animation.finished.then(() => { panel.hidden = !opening; animation.cancel(); panel.style.height = '' }).catch(() => {})
      }
    }
    const validate = (form: HTMLFormElement) => {
      const from = form.elements.namedItem('from') as HTMLInputElement, to = form.elements.namedItem('to') as HTMLInputElement
      to?.setCustomValidity(from?.value && to.value && to.value < from.value ? (is ? 'Lokadagur þarf að vera eftir upphafsdag eða sami dagur.' : 'The end date must be on or after the start date.') : '')
      const setup = form.elements.namedItem('setup') as HTMLInputElement | null, strike = form.elements.namedItem('strike') as HTMLInputElement | null
      strike?.setCustomValidity(setup?.value && strike.value && strike.value < setup.value ? (is ? 'Niðurtekt þarf að vera eftir uppsetningu.' : 'Strike must be after set-up.') : '')
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input,select').forEach(el => {
        if (el.hasAttribute('aria-invalid')) el.setAttribute('aria-invalid', String(!el.validity.valid))
        const error = document.getElementById(el.id+'-error'); if (error) { error.textContent = el.validity.valid ? '' : el.validationMessage; error.hidden = el.validity.valid }
      })
    }
    const change = (event: Event) => {
      const target = event.target as HTMLInputElement, form = target.closest('form'); if (!form) return
      validate(form)
      if (target.name === 'photos') {
        releasePhotos(); const panel = form.querySelector('[data-local-photos]')!; panel.replaceChildren()
        Array.from(target.files ?? []).forEach(file => {
          const figure = document.createElement('figure'), caption = document.createElement('figcaption'); caption.textContent = file.name
          if (file.type.startsWith('image/')) { const photo = new Image(); const url = URL.createObjectURL(file); urls.add(url); photo.src = url; photo.alt = (is ? 'Staðbundin mynd: ' : 'Local photo: ') + file.name; figure.appendChild(photo) }
          figure.appendChild(caption); panel.appendChild(figure)
        })
      }
    }
    const submit = (event: Event) => {
      event.preventDefault() // Never allow a native request, even before the motion engine has finished booting.
      const form = event.target as HTMLFormElement; validate(form)
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input,select').forEach(el => {
        el.setAttribute('aria-invalid', String(!el.validity.valid))
        let error = document.getElementById(el.id+'-error')
        if (!el.validity.valid && !error) { error = document.createElement('span'); error.id=el.id+'-error'; error.className='field-error'; el.insertAdjacentElement('afterend',error); el.setAttribute('aria-describedby', [el.getAttribute('aria-describedby'),error.id].filter(Boolean).join(' ')) }
        if (error) { error.textContent=el.validity.valid ? '' : el.validationMessage; error.hidden=el.validity.valid }
      })
    }
    root.addEventListener('click', click); root.addEventListener('change', change); root.addEventListener('input', change); root.addEventListener('submit', submit, true)
    const cfg: EngineConfig = {
      base: basePath(lang), routes: routeList(lang), otherRoutes: PAGE_IDS.map(id => hrefOf(id, is ? 'en' : 'is')), lang, t,
      render: k => renderPage(idOfKey(k, lang), lang),
      onCommit: d => { releasePhotos(); offDesc(); offDesc = setMetaDescription(d.description); setThemeColor(d.theme) },
      countries: { codes: [], excluded: [], dial: {}, example: {}, first: 'IS' }, policyHtml: t.policy, arrow: brand('arrow.svg'), fontProbe: '500 1em "Exton Sans"',
      flow: form => {
        const list: string[] = []
        form.querySelectorAll('[data-equipment-row]').forEach(row => { const sel = row.querySelector<HTMLSelectElement>('select')!, qty = row.querySelector<HTMLInputElement>('input')!; list.push(`${sel.selectedOptions[0]?.textContent} × ${qty.value}`) })
        const labels: Record<string, string> = is ? { branch:'Starfsstöð', from:'Leigja frá', to:'Leigja til', address:'Viðburðarstaður', setting:'Inni eða úti', start:'Viðburðardagur', setup:'Uppsetning', strike:'Niðurtekt', space:'Rými, m²', guests:'Gestafjöldi', power:'Rafmagn', access:'Aðkoma', fullname:'Nafn', phone:'Sími', email:'Netfang', company:'Fyrirtæki', message:'Nánari lýsing' } : { branch:'Branch', from:'Hire from', to:'Hire to', address:'Venue', setting:'Indoors or outdoors', start:'Event date', setup:'Set-up', strike:'Strike', space:'Space, m²', guests:'Attendance', power:'Power', access:'Access', fullname:'Name', phone:'Phone', email:'Email', company:'Company', message:'Further details' }
        Object.entries(labels).forEach(([name,label]) => { const value = shown(form,name); if (value) list.push(`${label}: ${value}`) })
        const files = (form.elements.namedItem('photos') as HTMLInputElement | null)?.files
        if (files?.length) list.push(`${is ? 'Myndir, aðeins staðbundnar' : 'Photos, local only'}: ${Array.from(files).map(f => f.name).join(', ')}`)
        list.push(is ? 'Verð á fyrirspurn' : 'Price on request')
        return { title: t.thanksTitle, text: form.dataset.kind === 'rental' ? t.thanksRental : t.thanksJob, list, note: t.thanksNote }
      },
    }
    const destroy = mountExton(cfg)
    return () => { destroy(); releasePhotos(); offFocus(); offDesc(); setThemeColor(oldTheme); robots.remove(); root.removeEventListener('click',click); root.removeEventListener('change',change); root.removeEventListener('input',change); root.removeEventListener('submit',submit,true); root.innerHTML = ''; html.classList.remove('bg-on','exton-on','is-cold'); html.lang=prev.lang; document.title=prev.title; if (prev.page) document.body.dataset.page=prev.page; else delete document.body.dataset.page; if(prev.category) document.body.dataset.category=prev.category; else delete document.body.dataset.category }
  },[lang,key])
  return <><style>{css}</style><div ref={rootRef} className="bg-root" lang={lang} /></>
}
