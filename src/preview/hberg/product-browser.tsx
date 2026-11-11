import { pageHref } from './paths'
import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { LINUR } from './data'
import { KATALOGUR } from './katalogur'
import { AllergenBadges } from './allergen-ui'
import { langt, ofnaemisLina, productCount } from './ofnaemi'
import { NUTRITION_COLUMNS, nutritionValue } from './naering'
import { SettIPoka } from './poki'
import { pop } from './popup'
import { PK, PRODUCTS, productBySlug, type Product } from './vorur'
import { faraA, reduced } from './ui'
import { MOTION } from './experience-style'

const clean = (text: string) => text.replace(/[-–—]/g, ' ')
const fold = (text: string) => text.toLocaleLowerCase('is').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae')
const quick = ['nuts', 'peanut', 'milk', 'gluten']
const groupOf = (slug: string) => KATALOGUR.find(g => g.items.some(v => v.slug === slug))!
const validLine = (line: string | null) => KATALOGUR.find(g => g.s === line)?.s ?? ''
const readUrl = () => {
  const q = new URLSearchParams(window.location.search)
  return { line: q.get('naering') === '1' ? '' : validLine(q.get('lina')), slug: q.get('vara') ?? '' }
}
const descriptions: Record<string, string> = {
  hnetur: 'Heilar, brotnar og sneiddar hnetur í matinn eða sem millimál.',
  avextir: 'Döðlur, apríkósur og fleiri ávextir í bakstur og nesti.',
  frae: 'Fræ til að strá yfir, blanda út í og baka með.',
  smjor: 'Hnetusmjör á brauðið, í sósur og í bakstur.',
  snakk: 'Súkkulaðihjúpaðar hnetur og snakk fyrir litlar sælustundir.',
  bakstur: 'Hráefni í bakstur og matargerð fyrir heimili og eldhús.',
  annad: 'Fleira úr úrvalinu okkar, meðal annars fuglafóður.',
}

export function ProductLines({ compact = false }: { compact?: boolean }) {
  return <section className={`hb-lines${compact ? " hb-linesCompact" : ""}`} id="linur" aria-labelledby="hb-lines-title">
    <h2 id="hb-lines-title" className="hb-disp">Vörulínur</h2>
    <p>Veldu vörulínu og skoðaðu allar vörurnar í henni.</p>
    <div className="hb-linesGrid">{LINUR.map(l => {
      const count = KATALOGUR.find(g => g.s === l.s)!.items.length
      return <a href={pageHref(`vorur/?lina=${l.s}`)} className="hb-lineTile" key={l.s} style={{ background: productBySlug(l.img)?.tint ?? l.g }} onClick={e => {
        if (!compact) return
        e.preventDefault()
        window.dispatchEvent(new CustomEvent('hb-browser-line', { detail: l.s }))
        faraA('#allar-vorur')
      }}>
        <span className="hb-lineArt"><img src={PK(l.img, 'pack', 'm')} alt="" width="400" height="450" loading="lazy" decoding="async" /></span>
        <span className="hb-lineText"><span className="hb-lineCount">{productCount(count)}</span><span className="hb-lineName">{l.t}</span><span className="hb-lineDesc">{descriptions[l.s]}</span><span className="hb-linePill">Skoða {productCount(count)} <span aria-hidden="true">↗</span></span></span>
      </a>
    })}</div>
  </section>
}

function Detail({ v }: { v: Product }) {
  const body = useRef<HTMLDivElement>(null)
  const layer = useRef<HTMLDivElement>(null)
  const previous = useRef<HTMLElement | null>(null)
  useLayoutEffect(() => {
    const el = body.current!, host = layer.current!
    const old = previous.current
    // A noninteractive snapshot overlaps the new product for a true crossfade.
    if (old && !reduced()) {
      old.setAttribute('aria-hidden', 'true'); old.setAttribute('inert', '')
      Object.assign(old.style, { position: 'absolute', inset: '0', pointerEvents: 'none' })
      host.appendChild(old)
      const out = old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: MOTION.ui, easing: MOTION.out, fill: 'forwards' })
      const incoming = el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: MOTION.ui, easing: MOTION.out })
      out.onfinish = () => old.remove()
      previous.current = el.cloneNode(true) as HTMLElement
      return () => { out.cancel(); incoming.cancel(); old.remove() }
    }
    previous.current = el.cloneNode(true) as HTMLElement
  }, [v.slug])
  return <aside className="hb-browserDetail" aria-label="Valin vara"><div className="hb-detailLayers" ref={layer}><div ref={body}>
    <div className="hb-detailArt" style={{ background: v.tint }}><img src={PK(v.slug, 'pack', 'm')} alt={clean(v.name.is)} width="400" height="450" loading="lazy" decoding="async" /></div>
    <p className="hb-detailLine">{groupOf(v.slug).t}</p>
    <h3>{clean(v.name.is)}</h3>
    {clean(v.desc.is) !== groupOf(v.slug).t && <p>{clean(v.desc.is)}</p>}
    <p className="hb-detailAllergens">{v.allergens === null ? 'Inniheldur: Upplýsingar vantar.' : ofnaemisLina(v)}</p>
    <p className="hb-detailBasis">Næringargildi í 100 g</p>
    <dl>{NUTRITION_COLUMNS.filter(c => ['energyKj', 'fat', 'carbohydrate', 'protein', 'salt'].includes(c.key)).map(c => <div key={c.key}><dt>{c.title}</dt><dd>{nutritionValue(v.slug, c.key)}</dd></div>)}</dl>
    <button className="hb-browserLink" onClick={() => pop.open({ k: 'naering', line: groupOf(v.slug).s })}>Öll næringargildi <span aria-hidden="true">↗</span></button>
    <div className="hb-detailActions"><SettIPoka key={v.slug} slug={v.slug} label="Setja á pöntunarlistann" /><button className="hb-browserSecondary" onClick={() => pop.open({ k: 'vara', slug: v.slug })}>Nánar <span aria-hidden="true">↗</span></button></div>
    <p className="hb-browserDisclaimer">Lestu alltaf á umbúðirnar. Ónefndur ofnæmisvaldur þýðir ekki að vara sé laus við hann.</p>
  </div></div></aside>
}

type Snapshot = { rect: DOMRect; clone: HTMLElement }
export function ProductBrowser() {
  const id = useId()
  const [line, setLine] = useState(() => readUrl().line)
  const [selected, setSelected] = useState(() => readUrl().slug)
  const [search, setSearch] = useState('')
  const [excluded, setExcluded] = useState<string[]>([])
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width:991px)').matches)
  useEffect(() => {
    const slug = new URLSearchParams(location.search).get('vara')
    if (window.matchMedia('(max-width:991px)').matches && slug && productBySlug(slug)) pop.open({ k: 'vara', slug })
  }, [])
  const grid = useRef<HTMLDivElement>(null)
  // Restore shared links without rewriting them; only interaction writes URL state.
  const touched = useRef(false)
  const before = useRef(new Map<string, Snapshot>())
  const animations = useRef<Animation[]>([])
  const ghosts = useRef<HTMLElement[]>([])
  const hover = useRef(0)
  const rows = KATALOGUR.filter(g => !line || g.s === line).flatMap(g => g.items)
    .filter(v => fold(`${v.name.is} ${groupOf(v.slug).t}`).includes(fold(search.trim())))
  // Unknown allergen declarations cannot establish an absence, so hide them too.
  const matches = rows.filter(v => !excluded.length || (v.allergens !== null && !v.allergens.some(a => excluded.includes(a))))
  const active = matches.find(v => v.slug === selected) ?? matches[0]
  const cancelMotion = () => {
    animations.current.forEach(a => a.cancel()); animations.current = []
    ghosts.current.forEach(el => el.remove()); ghosts.current = []
  }
  const capture = () => {
    window.clearTimeout(hover.current)
    cancelMotion(); before.current.clear()
    if (reduced()) return
    grid.current?.querySelectorAll<HTMLElement>('[data-browser-product]').forEach(el => {
      const rect = el.getBoundingClientRect()
      // Animate only painted tiles, keeping work bounded for the full catalogue.
      if (rect.bottom > 0 && rect.top < innerHeight) before.current.set(el.dataset.browserProduct!, { rect, clone: el.cloneNode(true) as HTMLElement })
    })
  }
  useLayoutEffect(() => {
    if (reduced() || !grid.current) { before.current.clear(); return }
    const host = grid.current, box = host.getBoundingClientRect()
    const present = new Set(matches.map(v => v.slug))
    before.current.forEach(({ rect, clone }, slug) => {
      if (present.has(slug)) return
      clone.removeAttribute('data-browser-product'); clone.removeAttribute('id'); clone.setAttribute('aria-hidden', 'true'); clone.setAttribute('inert', '')
      Object.assign(clone.style, { position: 'absolute', top: `${rect.top - box.top}px`, left: `${rect.left - box.left}px`, width: `${rect.width}px`, height: `${rect.height}px`, pointerEvents: 'none', zIndex: '2' })
      host.appendChild(clone); ghosts.current.push(clone)
      const a = clone.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.98)' }], { duration: MOTION.ui, easing: MOTION.out, fill: 'forwards' })
      a.onfinish = () => clone.remove(); animations.current.push(a)
    })
    host.querySelectorAll<HTMLElement>('[data-browser-product]').forEach(el => {
      const rect = el.getBoundingClientRect(), old = before.current.get(el.dataset.browserProduct!)
      if (rect.bottom <= 0 || rect.top >= innerHeight) return
      const frames = old ? [{ transform: `translate(${old.rect.left - rect.left}px,${old.rect.top - rect.top}px)` }, { transform: 'translate(0,0)' }] : [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }]
      animations.current.push(el.animate(frames, { duration: MOTION.panel, easing: MOTION.out }))
    })
    before.current.clear()
  }, [line, search, excluded])
  useEffect(() => {
    if (active && active.slug !== selected) setSelected(active.slug)
  }, [active?.slug, selected])
  useEffect(() => {
    const q = new URL(window.location.href)
    if (q.searchParams.get('naering') === '1') return
    if (!touched.current) return
    if (line) q.searchParams.set('lina', line); else q.searchParams.delete('lina')
    if (selected) q.searchParams.set('vara', selected); else q.searchParams.delete('vara')
    window.history.replaceState(null, '', q)
  }, [line, selected])
  useEffect(() => {
    const media = window.matchMedia('(max-width:991px)')
    const resize = () => { window.clearTimeout(hover.current); setCompact(media.matches) }
    const choose = (e: Event) => { touched.current = true; capture(); setLine(validLine((e as CustomEvent<string>).detail)); setSearch(''); setExcluded([]); setSelected('') }
    const restore = () => { if (new URLSearchParams(location.search).get('naering') === '1') return; touched.current = false; capture(); const q = readUrl(); setLine(q.line); setSelected(q.slug); setSearch(''); setExcluded([]) }
    media.addEventListener('change', resize); window.addEventListener('hb-browser-line', choose); window.addEventListener('popstate', restore)
    return () => { media.removeEventListener('change', resize); window.removeEventListener('hb-browser-line', choose); window.removeEventListener('popstate', restore); window.clearTimeout(hover.current); cancelMotion() }
  }, [])
  const choose = (v: Product) => { window.clearTimeout(hover.current); setSelected(v.slug); if (compact) pop.open({ k: 'vara', slug: v.slug }) }
  const navigate = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const cols = getComputedStyle(grid.current!).gridTemplateColumns.split(' ').length
    let next = index
    if (e.key === 'ArrowRight') next++
    else if (e.key === 'ArrowLeft') next--
    else if (e.key === 'ArrowDown') next += cols
    else if (e.key === 'ArrowUp') next -= cols
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = matches.length - 1
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(matches[index]); if (!compact) pop.open({ k: 'vara', slug: matches[index].slug }); return }
    else return
    e.preventDefault(); window.clearTimeout(hover.current)
    next = Math.max(0, Math.min(matches.length - 1, next)); setSelected(matches[next].slug)
    grid.current?.querySelectorAll<HTMLButtonElement>('[data-browser-product]')[next]?.focus({ preventScroll: true })
    grid.current?.querySelectorAll<HTMLButtonElement>('[data-browser-product]')[next]?.scrollIntoView({ block: 'nearest', behavior: 'instant' })
  }
  return <section className="hb-browser" id="allar-vorur" aria-labelledby={`${id}-title`} onPointerDown={() => { touched.current = true }} onKeyDown={() => { touched.current = true }}>
    <h2 id={`${id}-title`} className="hb-orderSr">Allar vörur</h2>
    <div className="hb-browserTools"><div className="hb-browserChips" role="group" aria-label="Vörulínur">{[{ s: '', t: 'Allar', items: PRODUCTS }, ...KATALOGUR].map(g => <button key={g.s} aria-pressed={line === g.s} onClick={() => { capture(); setLine(g.s); setSelected('') }}>{g.t} <span>{g.items.length}</span></button>)}</div>
      <label className="hb-browserSearch" htmlFor={`${id}-search`}>Leita að vöru<input id={`${id}-search`} type="search" value={search} placeholder="Nafn eða vörulína" onChange={e => { capture(); setSearch(e.target.value); setSelected('') }} /></label>
      <div className="hb-browserAvoid" role="group" aria-label="Fela vörur með ofnæmisvöldum"><span>Án:</span>{quick.map(a => <button key={a} aria-pressed={excluded.includes(a)} onClick={() => { capture(); setExcluded(old => old.includes(a) ? old.filter(x => x !== a) : [...old, a]); setSelected('') }}>{excluded.includes(a) && <span aria-hidden="true">✓ </span>}{langt(a).toLocaleLowerCase('is')}</button>)}</div>
    </div>
    <div className="hb-browserStatus"><p role="status">{productCount(matches.length)}{excluded.length > 0 && ` · Falið vegna ofnæmisvals eða ófullnægjandi upplýsinga: ${productCount(rows.length - matches.length)}`}</p><span className="hb-browserHint" id={`${id}-hint`}>{compact ? 'Veldu vöru til að sjá nánar.' : 'Örvatakkar velja vöru. Enter opnar nánar.'}</span></div>
    {excluded.length > 0 && <p className="hb-browserDisclaimer">Valið byggir á skráðu innihaldi. Lestu alltaf á umbúðirnar. Ónefndur ofnæmisvaldur þýðir ekki að vara sé laus við hann.</p>}
    {!matches.length && <p>Engar vörur fundust. <button className="hb-browserLink" onClick={() => { capture(); setLine(''); setSearch(''); setExcluded([]) }}>Sýna allar vörur</button></p>}
    <div className="hb-browserLayout"><div className="hb-browserGrid" ref={grid} role="listbox" aria-label="Vörur" aria-describedby={`${id}-hint`}>
      {matches.map((v, i) => <button key={v.slug} data-browser-product={v.slug} className="hb-browserTile" role="option" aria-selected={active?.slug === v.slug} tabIndex={active?.slug === v.slug ? 0 : -1} aria-label={clean(v.name.is)} onKeyDown={e => navigate(e, i)} onClick={() => choose(v)} onPointerEnter={e => {
        if (compact || e.pointerType !== 'mouse' || !matchMedia('(hover:hover) and (pointer:fine)').matches || (grid.current?.contains(document.activeElement) && document.activeElement?.matches(':focus-visible'))) return
        window.clearTimeout(hover.current); hover.current = window.setTimeout(() => setSelected(v.slug), 120)
      }} onPointerLeave={() => window.clearTimeout(hover.current)}>
        <span className="hb-browserArt" style={{ background: v.tint }}><img src={PK(v.slug, 'pack', 's')} alt="" width="240" height="270" loading="lazy" decoding="async" /><span className="hb-browserCheck" aria-hidden="true">✓</span></span><span className="hb-browserName">{clean(v.name.is)}</span><AllergenBadges p={v} />
      </button>)}
    </div>{active && !compact && <Detail v={active} />}</div>
  </section>
}

export function ProductTeaser() {
  return <section className="hb-teaser" id="allar-vorur" aria-labelledby="hb-teaser-title">
    <h2 className="hb-disp" id="hb-teaser-title">Allt H-Berg í einni hillu</h2>
    <p>57 vörur í sjö vörulínum, með innihaldi, ofnæmisvöldum og næringargildi.</p>
    <div className="hb-featured">{['mondlur', 'aprikosur-2', 'chia-frae-2', 'hnetusmjor', 'orkustykki', 'kasjusmjor-2'].map(slug => {
      const v = productBySlug(slug)!
      return <a key={slug} href={pageHref(`vorur/?vara=${slug}`)}><span style={{ background: v.tint }}><img src={PK(slug, 'pack', 's')} alt="" width="240" height="270" loading="lazy" /></span><b>{clean(v.name.is)}</b></a>
    })}</div>
    <div className="hb-teaserActions"><a className="hb-btn" href={pageHref('vorur/')}>Skoða allar vörur <span aria-hidden="true">↗</span></a><a className="hb-browserSecondary" href={pageHref('naeringargildi/')}>Næringargildi <span aria-hidden="true">↗</span></a></div>
  </section>
}
