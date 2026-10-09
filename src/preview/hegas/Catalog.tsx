import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BRAND_INFO, FAMILIES, FEATURED, PLATES, SHOP_TOTAL, STAFF, T, UNITS, UNIT_LABEL, brandSlug, defaultUnit, familyBySlug, firstLetter, fmtKr, img, isCompare, priceOf,
  loadCatalog, pad2, path, productImg, tel,
  type Catalog, type Lang, type Product, type Unit,
} from './data'
import { addProduct, useList } from './store'

/* ------------------------------------------------------------------ shared bits */
export function useCatalog() {
  const [cat, setCat] = useState<Catalog | null>(null)
  const [error, setError] = useState(false)
  useEffect(() => {
    let live = true
    loadCatalog().then((c) => { if (live) setCat(c) }).catch(() => { if (live) setError(true) })
    return () => { live = false }
  }, [])
  return { cat, error }
}

const fmtInt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
export const fmtCount = (lang: Lang, n: number) => (lang === 'is' ? fmtInt(n) : String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','))

export function Arrow() {
  return <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M4 12 12 4M5.5 4H12v6.5" /></svg>
}
/* the frame device: the logo's square (ink frame with its white inner line); the blue frame draws round on hover */
export function Ring({ dir = 'right' }: { dir?: 'right' | 'left' | 'up' }) {
  const rot = dir === 'left' ? 180 : dir === 'up' ? -45 : 0
  return (
    <span className="hg-ring" aria-hidden="true">
      <svg viewBox="0 0 44 44"><rect className="r-wall" x="2.5" y="2.5" width="39" height="39" /><rect className="r-bore" x="2.5" y="2.5" width="39" height="39" /><rect className="r-draw" x="2.5" y="2.5" width="39" height="39" pathLength={1} /></svg>
      <svg className="r-arr" viewBox="0 0 14 14" style={{ position: 'relative', width: 14, height: 14, transform: `rotate(${rot}deg)` }}><path d="M2 7h10M8 3l4 4-4 4" /></svg>
    </span>
  )
}
function Placeholder() {
  return (
    <span className="hg-card__ph" aria-hidden="true">
      <svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" /><rect x="16" y="16" width="68" height="68" /><path d="M30 84a20 20 0 0 1 40 0" /><circle cx="50" cy="70" r="8" /></svg>
    </span>
  )
}

export function AddButton({ p, lang }: { p: Product; lang: Lang }) {
  const { list } = useList()
  const on = list.lines.some((l) => l.sku === p.sku)
  const t = T[lang].cat
  return (
    <button type="button" className={`hg-add${on ? ' is-on' : ''}`} onClick={() => addProduct(p)} aria-label={`${on ? t.added : t.add}: ${p.name} (${p.sku})`} title={on ? t.added : t.add}>
      {on
        ? <svg key="on" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.5 3.2 3L13 4.5" /></svg>
        : <svg key="off" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>}
    </button>
  )
}

export function ProductCard({ p, lang, i = 0 }: { p: Product; lang: Lang; i?: number }) {
  const t = T[lang].cat
  return (
    <article className="hg-card" data-hg-fade="" data-hg-i={i}>
      <p className="hg-card__leaf">{p.brand || p.leaf}</p>
      <div className={`hg-card__img${p.img && p.white === false ? ' is-tile' : ''}`}>
        {p.img
          ? <img src={productImg(p.id)} alt={`${p.name}, ${t.sku.toLowerCase()} ${p.sku}`} loading="lazy" decoding="async" width={480} height={480} />
          : <><Placeholder /><span className="hg-sr">{t.noImg}</span></>}
      </div>
      <h3 className="hg-card__name"><Link to={path(lang, 'product', p.slug)}>{p.name}</Link></h3>
      <div className="hg-card__foot">
        <span className="hg-card__meta"><span className={`hg-card__price${p.price === null ? ' is-enq' : ''}`}>{p.sale && p.regular ? <><span className="hg-sr">{t.sale}: </span>{priceOf(p)}</> : priceOf(p)}</span>{p.price !== null && <span className="hg-card__sku">{t.sku} {p.sku}</span>}</span>
        <AddButton p={p} lang={lang} />
      </div>
    </article>
  )
}
function SkeletonCards({ n = 3 }: { n?: number }) {
  return <>{Array.from({ length: n }, (_, i) => <div key={i} className="hg-card hg-card--skel" aria-hidden="true" />)}</>
}

/* pick three to represent a family: products with Set's own photo, from different sub-families first */
function featured(ps: Product[], fam: number, n = 3): Product[] {
  const out: Product[] = (FEATURED[fam] ?? []).flatMap((sku) => ps.filter((p) => p.img && p.sku === sku))
  const withImg = ps.filter((p) => p.img && p.white !== false)
  if (out.length >= n) return out.slice(0, n)
  const seen = new Set<string>(out.map((p) => p.leaf))
  for (const p of withImg) { if (!seen.has(p.leaf) && !out.includes(p)) { out.push(p); seen.add(p.leaf) } if (out.length === n) return out }
  for (const p of withImg) { if (!out.includes(p)) out.push(p); if (out.length === n) return out }
  for (const p of ps) { if (!out.includes(p)) out.push(p); if (out.length === n) return out }
  return out
}

const matches = (p: Product, q: string) => {
  if (!q) return true
  const s = q.toLowerCase().trim()
  return p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s) || p.leaf.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s)
}

function SearchBox({ lang, value, onChange }: { lang: Lang; value: string; onChange: (v: string) => void }) {
  const t = T[lang].cat
  return (
    <div className="hg-search" role="search">
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4.5 4.5" /></svg>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={t.search} aria-label={t.search} enterKeyHint="search" />
    </div>
  )
}
function ViewToggle({ lang, mode, setMode }: { lang: Lang; mode: 'grid' | 'az'; setMode: (m: 'grid' | 'az') => void }) {
  const t = T[lang].cat
  return (
    <div className="hg-toggle" role="group" aria-label={lang === 'is' ? 'Framsetning' : 'Layout'}>
      <button type="button" aria-pressed={mode === 'az'} onClick={() => setMode('az')}>{t.az}</button>
      <button type="button" aria-pressed={mode === 'grid'} onClick={() => setMode('grid')} aria-label={t.grid} title={t.grid}>
        <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1" y="1" width="6" height="6" /><rect x="9" y="1" width="6" height="6" /><rect x="1" y="9" width="6" height="6" /><rect x="9" y="9" width="6" height="6" /></svg>
      </button>
    </div>
  )
}

/* swap with the Live-up works-wall crossfade: out .35s, new content resolves (M8) */
function useSwap<T>(value: T): [T, boolean] {
  const [shown, setShown] = useState(value)
  const [swapping, setSwapping] = useState(false)
  const first = useRef(true)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return }
    setSwapping(true)
    const id = window.setTimeout(() => { setShown(value); setSwapping(false) }, 200)
    return () => window.clearTimeout(id)
  }, [value])
  return [shown, swapping]
}

function AZList({ lang, products }: { lang: Lang; products: Product[] }) {
  const t = T[lang].cat
  const groups = useMemo(() => {
    const sorted = products.slice().sort((a, b) => isCompare(a.name, b.name))
    const g = new Map<string, Product[]>()
    for (const p of sorted) { const k = firstLetter(p.name); if (!g.has(k)) g.set(k, []); g.get(k)!.push(p) }
    return [...g.entries()]
  }, [products])
  if (!products.length) return <p className="hg-empty">{t.none}</p>
  const id = (k: string) => `hg-az-${encodeURIComponent(k)}`
  return (
    <div className="hg-az">
      <nav className="hg-az__jump" aria-label={t.jump}>
        {groups.map(([k]) => <a key={k} href={`#${id(k)}`} onClick={(e) => { e.preventDefault(); document.getElementById(id(k))?.scrollIntoView({ block: 'start' }) }}>{k}</a>)}
      </nav>
      {groups.map(([k, ps]) => (
        <section key={k} className="hg-az__group" id={id(k)} aria-labelledby={`${id(k)}-h`}>
          <h3 className="hg-az__letter hg-d" id={`${id(k)}-h`}>{k}</h3>
          <ul className="hg-az__rows">
            {ps.map((p) => (
              <li key={p.id} className="hg-az__row">
                <span className="hg-az__sku">{p.price === null ? '' : p.sku}</span>
                <Link to={path(lang, 'product', p.slug)}>{p.name}</Link>
                <span className="hg-az__leaf">{p.leaf}</span>
                <AddButton p={p} lang={lang} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ home: VÖRUR, rows per family (image 1) */
export function CatalogSection({ lang }: { lang: Lang }) {
  const t = T[lang].cat
  const { cat, error } = useCatalog()
  const [fam, setFam] = useState(0)
  const [brand, setBrand] = useState('')
  const [q, setQ] = useState('')
  const [mode, setMode] = useState<'grid' | 'az'>('grid')
  const key = useMemo(() => ({ fam, brand, q: q.trim(), mode }), [fam, brand, q, mode])
  const [shown, swapping] = useSwap(key)
  const total = cat?.shopTotal ?? SHOP_TOTAL
  const brands = useMemo(() => (cat ? [...new Set(cat.products.map((p) => p.brand).filter(Boolean))].sort(isCompare) : []), [cat])

  const filtered = useMemo(() => (cat ? cat.products.filter((p) => (!shown.fam || p.fam === shown.fam) && (!shown.brand || p.brand === shown.brand) && matches(p, shown.q)) : []), [cat, shown])
  const famList = FAMILIES.filter((f) => !shown.fam || f.n === shown.fam)
  const searching = !!shown.q || !!shown.brand

  return (
    <section className="hg-cat" id="vorur" aria-labelledby="hg-cat-h">
      <div className="hg-cat__head">
        <h2 className="hg-d hg-d--xl" id="hg-cat-h" data-hg-mask="" data-hg-fit="">{t.title}</h2>
        {cat && <p className="hg-cat__lead" data-hg-fade="">{t.lead(cat.products.length, fmtCount(lang, total))}</p>}
      </div>
      <div className="hg-dots" aria-hidden="true" />
      <div className="hg-filter">
        <label>
          <span>{t.filter}:</span>
          <select className="hg-select" value={fam} onChange={(e) => setFam(Number(e.target.value))}>
            <option value={0}>{t.all}</option>
            {FAMILIES.map((f) => <option key={f.n} value={f.n}>{pad2(f.n)} {lang === 'is' ? f.is : f.en}</option>)}
          </select>
        </label>
        <label>
          <span>{t.brand}:</span>
          <select className="hg-select" value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="">{t.allBrands}</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <SearchBox lang={lang} value={q} onChange={setQ} />
        {cat && (searching || mode === 'az') && <span className="hg-filter__count" aria-live="polite">{t.results(filtered.length)}</span>}
        <ViewToggle lang={lang} mode={mode} setMode={setMode} />
      </div>
      <div className={`hg-stage${swapping ? ' is-swapping' : ''}`}>
        {error && <p className="hg-empty" role="alert">{t.error}</p>}
        {shown.mode === 'az' && cat
          ? <AZList lang={lang} products={filtered} />
          : famList.map((f) => {
              const ps = cat ? filtered.filter((p) => p.fam === f.n) : []
              if (cat && !ps.length) return null
              const cards = searching ? ps.slice(0, 3) : featured(ps, f.n)
              return (
                <article className="hg-row" key={f.n} aria-labelledby={`hg-fam-${f.n}`}>
                  <div className="hg-row__text">
                    <p className="hg-row__n hg-tnum">{pad2(f.n)}</p>
                    <h3 className="hg-h" id={`hg-fam-${f.n}`} data-hg-words="">{lang === 'is' ? f.is : f.en}</h3>
                    <p className="hg-row__desc">{f.desc[lang]}</p>
                    {cat && <p className="hg-row__meta">{searching ? t.results(ps.length) : f.enquiry ? t.inSampleEnquiry(ps.length) : t.inSample(ps.length, fmtCount(lang, f.shopCount))}</p>}
                    <div className="hg-row__links">
                      <Link className="hg-ringlink" to={path(lang, 'family', f.slug)}><Ring />{t.viewAll}<span className="hg-sr"> {lang === 'is' ? f.is : f.en}</span></Link>
                      <span className="hg-row__docs">
                        <a className="hg-link" href={f.shop} target="_blank" rel="noopener">{f.enquiry ? 'Á hegas.is' : t.pdf}</a>
                      </span>
                    </div>
                  </div>
                  <div className="hg-row__cards">
                    {cat ? cards.map((p, i) => <ProductCard key={p.id} p={p} lang={lang} i={i} />) : <SkeletonCards />}
                  </div>
                </article>
              )
            })}
        {cat && shown.mode === 'grid' && !filtered.length && <p className="hg-empty">{t.none}</p>}
        {!cat && !error && <p className="hg-sr" role="status">{t.loading}</p>}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ family page */
const PER = 24
export function FamilyPage({ lang, slug }: { lang: Lang; slug: string }) {
  const t = T[lang].cat
  const f = familyBySlug(slug) ?? FAMILIES[0]
  const { cat, error } = useCatalog()
  const [sub, setSub] = useState('')
  const [q, setQ] = useState('')
  const [mode, setMode] = useState<'grid' | 'az'>('grid')
  const [page, setPage] = useState(1)
  const key = useMemo(() => ({ sub, q: q.trim(), mode, page }), [sub, q, mode, page])
  const [shown, swapping] = useSwap(key)
  const top = useRef<HTMLDivElement>(null)
  useEffect(() => { setPage(1) }, [sub, q, mode])

  const meta = cat?.families.find((x) => x.n === f.n)
  const all = useMemo(() => (cat ? cat.products.filter((p) => p.fam === f.n) : []), [cat, f.n])
  const list = useMemo(() => all.filter((p) => (!shown.sub || p.sub === shown.sub) && matches(p, shown.q)).sort((a, b) => isCompare(a.name, b.name)), [all, shown])
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const cur = Math.min(shown.page, pages)
  const slice = list.slice((cur - 1) * PER, cur * PER)
  const name = lang === 'is' ? f.is : f.en
  const go = (n: number) => { setPage(n); top.current?.scrollIntoView({ block: 'start' }) }

  return (
    <div className="hg-page">
      <nav className="hg-crumbs" aria-label={lang === 'is' ? 'Brauðmolar' : 'Breadcrumb'}>
        <Link to={`${path(lang, 'home')}#vorur`}>{t.back}</Link><span aria-hidden="true">/</span><span>{pad2(f.n)} {name}</span>
      </nav>
      <div className="hg-fam__head">
        <h1 className="hg-d hg-d--l" data-hg-mask="" data-hg-fit="">{name}</h1>
      </div>
      <div className="hg-fam__intro">
        <p className="hg-lede" data-hg-fade="">{f.desc[lang]}{cat ? ` ${f.enquiry ? t.inSampleEnquiry(all.length) : t.inSample(all.length, fmtCount(lang, f.shopCount))}.` : ''}</p>
        <div>
          <a className="hg-link" href={f.shop} target="_blank" rel="noopener">{f.enquiry ? 'Yfirborðsefni og plötur á hegas.is' : `${f.is} í netverslun`}</a>
        </div>
      </div>
      <div className="hg-dots" style={{ margin: '40px var(--gut) 0' }} aria-hidden="true" />
      <div ref={top} style={{ scrollMarginTop: 'calc(var(--bar) + 8px)' }} />
      {meta && meta.subs.length > 1 && (
        <div className="hg-tabs" role="group" aria-label={t.sub} style={{ paddingTop: 12 }}>
          <button type="button" aria-pressed={!sub} onClick={() => setSub('')}>{t.allSubs}<sup>{all.length}</sup></button>
          {meta.subs.map(([s, n]) => <button key={s} type="button" aria-pressed={sub === s} onClick={() => setSub(s)}>{s}<sup>{n}</sup></button>)}
        </div>
      )}
      <div className="hg-filter">
        <SearchBox lang={lang} value={q} onChange={setQ} />
        {cat && <span className="hg-filter__count" aria-live="polite">{t.results(list.length)}</span>}
        <ViewToggle lang={lang} mode={mode} setMode={setMode} />
      </div>
      <div className={`hg-stage${swapping ? ' is-swapping' : ''}`}>
        {error && <p className="hg-empty" role="alert">{t.error}</p>}
        {!cat && !error && <div className="hg-grid"><SkeletonCards n={8} /></div>}
        {cat && shown.mode === 'az' && <AZList lang={lang} products={list} />}
        {cat && shown.mode === 'grid' && (list.length
          ? <div className="hg-grid">{slice.map((p, i) => <ProductCard key={p.id} p={p} lang={lang} i={i % 4} />)}</div>
          : <p className="hg-empty">{t.none}</p>)}
        {cat && shown.mode === 'grid' && pages > 1 && (
          <nav className="hg-pager" aria-label={t.page}>
            <button type="button" onClick={() => go(cur - 1)} disabled={cur === 1} aria-label={t.prev}><Ring dir="left" /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className="hg-pager__n" aria-current={n === cur ? 'page' : undefined} onClick={() => go(n)} aria-label={`${t.page} ${n}`}>{n}</button>
            ))}
            <button type="button" onClick={() => go(cur + 1)} disabled={cur === pages} aria-label={t.next}><Ring /></button>
          </nav>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ product page */
const EGILL = STAFF.find((x) => x.email === 'egill@hegas.is')!
export function ProductPage({ lang, slug }: { lang: Lang; slug: string }) {
  const t = T[lang].cat
  const L = T[lang].list
  const { cat, error } = useCatalog()
  const p = cat?.products.find((x) => x.slug === slug)
  const [qty, setQty] = useState(1)
  const [unit, setUnit] = useState<Unit>('stk')
  useEffect(() => { if (p) { setUnit(defaultUnit(p)); setQty(1) } }, [p])
  const { list } = useList()
  const onList = p ? list.lines.find((l) => l.sku === p.sku) : undefined

  if (error) return <div className="hg-page"><p className="hg-empty" role="alert">{t.error}</p></div>
  if (!cat) return <div className="hg-page"><p className="hg-empty" role="status">{t.loading}</p></div>
  if (!p) return <div className="hg-page"><p className="hg-empty">{t.none}</p><p className="hg-wrap"><Link className="hg-link" to={`${path(lang, 'home')}#vorur`}>{t.back}</Link></p></div>

  const f = FAMILIES.find((x) => x.n === p.fam)!
  const related = cat.products.filter((x) => x.leaf === p.leaf && x.id !== p.id).slice(0, 8)
  const more = related.length ? related : cat.products.filter((x) => x.fam === p.fam && x.id !== p.id).slice(0, 8)
  const advisor = p.attrs.find(([k]) => k === 'Ráðgjöf')
  const spec: [string, string][] = [
    ...(p.price !== null ? [[t.sku, p.sku] as [string, string]] : []),
    ...(p.brand ? [[t.brand, p.brand] as [string, string]] : []),
    ['Flokkur', p.leaf],
    ...(p.stock ? [['Lagerstaða', p.stock] as [string, string]] : []),
    ...p.attrs.filter(([k]) => k !== 'Ráðgjöf'),
  ]
  return (
    <div className="hg-page">
      <nav className="hg-crumbs" aria-label="Brauðmolar">
        <Link to={`${path(lang, 'home')}#vorur`}>{t.back}</Link><span aria-hidden="true">/</span>
        <Link to={path(lang, 'family', f.slug)}>{f.is}</Link><span aria-hidden="true">/</span>
        <span>{p.leaf}</span>
      </nav>
      <div className="hg-prod">
        <div className={`hg-prod__img${p.img && p.white === false ? ' is-tile' : ''}`} data-hg-fade="">
          {p.img ? <img src={productImg(p.id)} alt={`${p.name}${p.price !== null ? `, ${t.sku.toLowerCase()} ${p.sku}` : ''}`} width={480} height={480} /> : <><Placeholder /><span className="hg-sr">{t.noImg}</span></>}
        </div>
        <div className="hg-prod__info">
          {p.brand && <p className="hg-label">{p.brand}</p>}
          <h1>{p.name}</h1>
          <div className="hg-prod__price">
            {p.price === null
              ? <><b>{t.enquiry}</b><span>Fer á efnislistann og söludeild sendir verð.</span></>
              : <><b className="hg-tnum">{fmtKr(p.price)}</b><span>{t.shopPrice}{p.sale && p.regular && p.regular > p.price ? ` · ${t.was} ${fmtKr(p.regular)}` : ''}</span></>}
          </div>
          {p.short && <p className="hg-prod__short">{p.short}</p>}
          <dl className="hg-spec">
            {spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="hg-buy">
            <div className="hg-qty">
              <button type="button" onClick={() => setQty((x) => Math.max(1, x - 1))} aria-label={L.less}>−</button>
              <input inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value.replace(/\D/g, ''), 10) || 1))} aria-label={L.cols.qty} />
              <button type="button" onClick={() => setQty((x) => x + 1)} aria-label={L.more}>+</button>
            </div>
            <select className="hg-select" value={unit} onChange={(e) => setUnit(e.target.value as Unit)} aria-label={L.units}>
              {UNITS.map((u) => <option key={u} value={u}>{UNIT_LABEL[lang][u]}</option>)}
            </select>
            <button type="button" className="hg-btn" onClick={() => addProduct(p, qty, unit)}>
              {t.addToList}<Arrow />
            </button>
          </div>
          {onList && <p className="hg-prod__on" aria-live="polite"><span aria-hidden="true" />{t.added}: {onList.qty} {UNIT_LABEL[lang][onList.unit]}</p>}
          {advisor && (
            <p className="hg-prod__note">Nánari upplýsingar veitir {advisor[1].split(',')[0]}: <a className="hg-link" href={`mailto:${advisor[1].split(', ')[1] ?? EGILL.email}?subject=${encodeURIComponent(p.name)}`}>{advisor[1].split(', ')[1] ?? EGILL.email}</a>{advisor[1].includes('Egill') && <> · <a className="hg-link" href={tel(EGILL.direct!)}>{EGILL.direct}</a></>}</p>
          )}
          <p className="hg-prod__note">{L.lead}</p>
          <div className="hg-prod__links">
            <a className="hg-link" href={p.url} target="_blank" rel="noopener">{p.price === null ? 'Nánar á hegas.is' : 'Kaupa í netverslun'}</a>
            {p.brand && cat.products.filter((x) => x.brand === p.brand).length > 1 && <Link className="hg-link" to={path(lang, 'brand', brandSlug(p.brand))}>Allt frá {p.brand}</Link>}
          </div>
        </div>
      </div>
      {more.length > 0 && (
        <section className="hg-related" aria-labelledby="hg-rel-h">
          <h2 className="hg-h" id="hg-rel-h" data-hg-words="">{related.length ? p.leaf : f.is}</h2>
          <div className="hg-grid">{more.map((x, i) => <ProductCard key={x.id} p={x} lang={lang} i={i % 4} />)}</div>
        </section>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ brand page: one home per brand */
export function BrandPage({ lang, slug }: { lang: Lang; slug: string }) {
  const t = T[lang].cat
  const B = T[lang].brands
  const { cat, error } = useCatalog()
  const name = cat?.products.find((p) => brandSlug(p.brand) === slug)?.brand ?? PLATES.find((x) => brandSlug(x.key) === slug)?.key ?? ''
  const ps = useMemo(() => (cat ? cat.products.filter((p) => p.brand === name).sort((a, b) => a.fam - b.fam || isCompare(a.name, b.name)) : []), [cat, name])
  const plate = PLATES.find((x) => x.key === name)
  const info = BRAND_INFO[name]
  const advisor = info?.contact === 'egill' ? EGILL : undefined
  if (error) return <div className="hg-page"><p className="hg-empty" role="alert">{t.error}</p></div>
  if (!cat) return <div className="hg-page"><p className="hg-empty" role="status">{t.loading}</p></div>
  if (!name) return <div className="hg-page"><p className="hg-empty">{t.none}</p><p className="hg-wrap"><Link className="hg-link" to={`${path(lang, 'home')}#merki`}>{B.back}</Link></p></div>
  return (
    <div className="hg-page">
      <nav className="hg-crumbs" aria-label="Brauðmolar">
        <Link to={`${path(lang, 'home')}#merki`}>{B.back}</Link><span aria-hidden="true">/</span><span>{name}</span>
      </nav>
      <div className="hg-fam__head">
        <h1 className="hg-d hg-d--l" data-hg-mask="" data-hg-fit="">{plate?.name.split(' · ')[0] ?? name}</h1>
      </div>
      <div className="hg-brand">
        <div className="hg-brand__text">
          <p className="hg-lede" style={{ color: 'var(--ink)' }} data-hg-fade="">{info?.body ?? `${B.products(ps.length)} frá ${name}.`}</p>
          <p className="hg-help" style={{ marginTop: 14 }}>{B.products(ps.length)}</p>
          <div className="hg-brand__links">
            {info?.page && <a className="hg-link" href={info.page[1]} target="_blank" rel="noopener">{info.page[0]}</a>}
            {advisor && <span className="hg-help">{B.contact} {advisor.name}: <a className="hg-link" href={`mailto:${advisor.email}?subject=${encodeURIComponent(name)}`}>{advisor.email}</a></span>}
          </div>
        </div>
        {plate && (
          <figure className="hg-brand__fig" data-hg-fade="">
            <img src={img(plate.img, 1600)} srcSet={`${img(plate.img, 800)} 800w, ${img(plate.img, 1600)} 1600w`} sizes="(max-width: 900px) 100vw, 50vw" alt={plate.alt} loading="lazy" decoding="async" />
          </figure>
        )}
      </div>
      <div className="hg-dots" style={{ margin: '40px var(--gut) 0' }} aria-hidden="true" />
      {ps.length ? <div className="hg-grid" style={{ paddingTop: 24 }}>{ps.map((p, i) => <ProductCard key={p.id} p={p} lang={lang} i={i % 4} />)}</div> : <p className="hg-empty">{t.none}</p>}
    </div>
  )
}
