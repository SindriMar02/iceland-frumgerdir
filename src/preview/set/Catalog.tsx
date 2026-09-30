import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FAMILIES, FEATURED, SET_TOTAL, T, UNITS, UNIT_LABEL, defaultUnit, familyBySlug, firstLetter, isCompare, loadCatalog, pad2, path, productImg,
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
/* the ring device: a pipe wall (black) with its bore line (white), drawn from the logo's stroke logic */
export function Ring({ dir = 'right' }: { dir?: 'right' | 'left' | 'up' }) {
  const rot = dir === 'left' ? 180 : dir === 'up' ? -45 : 0
  return (
    <span className="set-ring" aria-hidden="true">
      <svg viewBox="0 0 44 44"><circle className="r-wall" cx="22" cy="22" r="19.5" /><circle className="r-bore" cx="22" cy="22" r="19.5" /><circle className="r-draw" cx="22" cy="22" r="19.5" pathLength={1} transform="rotate(-90 22 22)" /></svg>
      <svg className="r-arr" viewBox="0 0 14 14" style={{ position: 'relative', width: 14, height: 14, transform: `rotate(${rot}deg)` }}><path d="M2 7h10M8 3l4 4-4 4" /></svg>
    </span>
  )
}
function Placeholder() {
  return (
    <span className="set-card__ph" aria-hidden="true">
      <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" /><circle cx="50" cy="50" r="30" /><circle cx="50" cy="50" r="30" strokeDasharray="2 5" /></svg>
    </span>
  )
}

export function AddButton({ p, lang }: { p: Product; lang: Lang }) {
  const { list } = useList()
  const on = list.lines.some((l) => l.sku === p.sku)
  const t = T[lang].cat
  return (
    <button type="button" className={`set-add${on ? ' is-on' : ''}`} onClick={() => addProduct(p)} aria-label={`${on ? t.added : t.add}: ${p.name} (${p.sku})`} title={on ? t.added : t.add}>
      {on
        ? <svg key="on" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.5 3.2 3L13 4.5" /></svg>
        : <svg key="off" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>}
    </button>
  )
}

export function ProductCard({ p, lang, i = 0 }: { p: Product; lang: Lang; i?: number }) {
  const t = T[lang].cat
  return (
    <article className="set-card" data-set-fade="" data-set-i={i}>
      <p className="set-card__leaf">{p.leaf}</p>
      <div className={`set-card__img${p.img && p.white === false ? ' is-tile' : ''}`}>
        {p.img
          ? <img src={productImg(p.id)} alt={`${p.name}, ${t.sku.toLowerCase()} ${p.sku}`} loading="lazy" decoding="async" width={480} height={480} />
          : <><Placeholder /><span className="set-sr">{t.noImg}</span></>}
      </div>
      <h3 className="set-card__name"><Link to={path(lang, 'product', p.slug)}>{p.name}</Link></h3>
      <div className="set-card__foot">
        <span className="set-card__sku">{t.sku} {p.sku}</span>
        <AddButton p={p} lang={lang} />
      </div>
    </article>
  )
}
function SkeletonCards({ n = 3 }: { n?: number }) {
  return <>{Array.from({ length: n }, (_, i) => <div key={i} className="set-card set-card--skel" aria-hidden="true" />)}</>
}

/* pick three to represent a family: products with Set's own photo, from different sub-families first */
function featured(ps: Product[], fam: number, n = 3): Product[] {
  const withImg = ps.filter((p) => p.img && p.white !== false)
  const out: Product[] = (FEATURED[fam] ?? []).flatMap((sku) => withImg.filter((p) => p.sku === sku))
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
  return p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s) || p.leaf.toLowerCase().includes(s)
}

function SearchBox({ lang, value, onChange }: { lang: Lang; value: string; onChange: (v: string) => void }) {
  const t = T[lang].cat
  return (
    <div className="set-search" role="search">
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4.5 4.5" /></svg>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={t.search} aria-label={t.search} enterKeyHint="search" />
    </div>
  )
}
function ViewToggle({ lang, mode, setMode }: { lang: Lang; mode: 'grid' | 'az'; setMode: (m: 'grid' | 'az') => void }) {
  const t = T[lang].cat
  return (
    <div className="set-toggle" role="group" aria-label={lang === 'is' ? 'Framsetning' : 'Layout'}>
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
  if (!products.length) return <p className="set-empty">{t.none}</p>
  const id = (k: string) => `set-az-${encodeURIComponent(k)}`
  return (
    <div className="set-az">
      <nav className="set-az__jump" aria-label={t.jump}>
        {groups.map(([k]) => <a key={k} href={`#${id(k)}`} onClick={(e) => { e.preventDefault(); document.getElementById(id(k))?.scrollIntoView({ block: 'start' }) }}>{k}</a>)}
      </nav>
      {groups.map(([k, ps]) => (
        <section key={k} className="set-az__group" id={id(k)} aria-labelledby={`${id(k)}-h`}>
          <h3 className="set-az__letter set-d" id={`${id(k)}-h`}>{k}</h3>
          <ul className="set-az__rows">
            {ps.map((p) => (
              <li key={p.id} className="set-az__row">
                <span className="set-az__sku">{p.sku}</span>
                <Link to={path(lang, 'product', p.slug)}>{p.name}</Link>
                <span className="set-az__leaf">{p.leaf}</span>
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
  const [q, setQ] = useState('')
  const [mode, setMode] = useState<'grid' | 'az'>('grid')
  const key = useMemo(() => ({ fam, q: q.trim(), mode }), [fam, q, mode])
  const [shown, swapping] = useSwap(key)
  const total = SET_TOTAL

  const filtered = useMemo(() => (cat ? cat.products.filter((p) => (!shown.fam || p.fam === shown.fam) && matches(p, shown.q)) : []), [cat, shown])
  const famList = FAMILIES.filter((f) => !shown.fam || f.n === shown.fam)
  const searching = !!shown.q

  return (
    <section className="set-cat" id="vorur" aria-labelledby="set-cat-h">
      <div className="set-cat__head">
        <h2 className="set-d set-d--xl" id="set-cat-h" data-set-mask="" data-set-fit="">{t.title}</h2>
        {cat && <p className="set-cat__lead" data-set-fade="">{t.lead(cat.products.length, fmtCount(lang, total))}</p>}
      </div>
      <div className="set-dots" aria-hidden="true" />
      <div className="set-filter">
        <label>
          <span>{t.filter}:</span>
          <select className="set-select" value={fam} onChange={(e) => setFam(Number(e.target.value))}>
            <option value={0}>{t.all}</option>
            {FAMILIES.map((f) => <option key={f.n} value={f.n}>{pad2(f.n)} {lang === 'is' ? f.is : f.en}</option>)}
          </select>
        </label>
        <SearchBox lang={lang} value={q} onChange={setQ} />
        {cat && (searching || mode === 'az') && <span className="set-filter__count" aria-live="polite">{t.results(filtered.length)}</span>}
        <ViewToggle lang={lang} mode={mode} setMode={setMode} />
      </div>
      <div className={`set-stage${swapping ? ' is-swapping' : ''}`}>
        {error && <p className="set-empty" role="alert">{t.error}</p>}
        {shown.mode === 'az' && cat
          ? <AZList lang={lang} products={filtered} />
          : famList.map((f) => {
              const ps = cat ? filtered.filter((p) => p.fam === f.n) : []
              if (cat && !ps.length) return null
              const meta = cat?.families.find((x) => x.n === f.n)
              const cards = searching ? ps.slice(0, 3) : featured(ps, f.n)
              return (
                <article className="set-row" key={f.n} aria-labelledby={`set-fam-${f.n}`}>
                  <div className="set-row__text">
                    <p className="set-row__n set-tnum">{pad2(f.n)}</p>
                    <h3 className="set-h" id={`set-fam-${f.n}`} data-set-words="">{lang === 'is' ? f.is : f.en}</h3>
                    <p className="set-row__desc">{f.desc[lang]}</p>
                    {meta && <p className="set-row__meta">{searching ? t.results(ps.length) : t.inSample(ps.length, fmtCount(lang, meta.setCount))}</p>}
                    <div className="set-row__links">
                      <Link className="set-ringlink" to={path(lang, 'family', f.slug)}><Ring />{t.viewAll}<span className="set-sr"> {lang === 'is' ? f.is : f.en}</span></Link>
                      <span className="set-row__docs">
                        <a className="set-link" href={f.pdf} target="_blank" rel="noopener">{t.pdf}</a>
                        {f.handbook && <a className="set-link" href={f.handbook} target="_blank" rel="noopener">{t.handbook}</a>}
                      </span>
                    </div>
                  </div>
                  <div className="set-row__cards">
                    {cat ? cards.map((p, i) => <ProductCard key={p.id} p={p} lang={lang} i={i} />) : <SkeletonCards />}
                  </div>
                </article>
              )
            })}
        {cat && shown.mode === 'grid' && !filtered.length && <p className="set-empty">{t.none}</p>}
        {!cat && !error && <p className="set-sr" role="status">{t.loading}</p>}
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
  const list = useMemo(() => all.filter((p) => (!shown.sub || p.sub === shown.sub) && matches(p, shown.q)).sort((a, b) => isCompare(a.sku, b.sku)), [all, shown])  /* Set's own order: by item number */
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const cur = Math.min(shown.page, pages)
  const slice = list.slice((cur - 1) * PER, cur * PER)
  const name = lang === 'is' ? f.is : f.en
  const go = (n: number) => { setPage(n); top.current?.scrollIntoView({ block: 'start' }) }

  return (
    <div className="set-page">
      <nav className="set-crumbs" aria-label={lang === 'is' ? 'Brauðmolar' : 'Breadcrumb'}>
        <Link to={`${path(lang, 'home')}#vorur`}>{t.back}</Link><span aria-hidden="true">/</span><span>{pad2(f.n)} {name}</span>
      </nav>
      <div className="set-fam__head">
        <h1 className="set-d set-d--l" data-set-mask="" data-set-fit="">{name}</h1>
      </div>
      <div className="set-fam__intro">
        <p className="set-lede" data-set-fade="">{f.desc[lang]}{meta ? ` ${t.inSample(all.length, fmtCount(lang, meta.setCount))}.` : ''}</p>
        <div>
          <a className="set-link" href={f.pdf} target="_blank" rel="noopener">{t.pdf}</a>
          {f.handbook && <a className="set-link" href={f.handbook} target="_blank" rel="noopener">{t.handbook}</a>}
        </div>
      </div>
      <div className="set-dots" style={{ margin: '40px var(--gut) 0' }} aria-hidden="true" />
      <div ref={top} style={{ scrollMarginTop: 'calc(var(--bar) + 8px)' }} />
      {meta && meta.subs.length > 1 && (
        <div className="set-tabs" role="group" aria-label={t.sub} style={{ paddingTop: 12 }}>
          <button type="button" aria-pressed={!sub} onClick={() => setSub('')}>{t.allSubs}<sup>{all.length}</sup></button>
          {meta.subs.map(([s, n]) => <button key={s} type="button" aria-pressed={sub === s} onClick={() => setSub(s)}>{s}<sup>{n}</sup></button>)}
        </div>
      )}
      <div className="set-filter">
        <SearchBox lang={lang} value={q} onChange={setQ} />
        {cat && <span className="set-filter__count" aria-live="polite">{t.results(list.length)}</span>}
        <ViewToggle lang={lang} mode={mode} setMode={setMode} />
      </div>
      <div className={`set-stage${swapping ? ' is-swapping' : ''}`}>
        {error && <p className="set-empty" role="alert">{t.error}</p>}
        {!cat && !error && <div className="set-grid"><SkeletonCards n={8} /></div>}
        {cat && shown.mode === 'az' && <AZList lang={lang} products={list} />}
        {cat && shown.mode === 'grid' && (list.length
          ? <div className="set-grid">{slice.map((p, i) => <ProductCard key={p.id} p={p} lang={lang} i={i % 4} />)}</div>
          : <p className="set-empty">{t.none}</p>)}
        {cat && shown.mode === 'grid' && pages > 1 && (
          <nav className="set-pager" aria-label={t.page}>
            <button type="button" onClick={() => go(cur - 1)} disabled={cur === 1} aria-label={t.prev}><Ring dir="left" /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className="set-pager__n" aria-current={n === cur ? 'page' : undefined} onClick={() => go(n)} aria-label={`${t.page} ${n}`}>{n}</button>
            ))}
            <button type="button" onClick={() => go(cur + 1)} disabled={cur === pages} aria-label={t.next}><Ring /></button>
          </nav>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ product page */
export function ProductPage({ lang, slug }: { lang: Lang; slug: string }) {
  const t = T[lang].cat
  const L = T[lang].list
  const { cat, error } = useCatalog()
  const p = cat?.products.find((x) => x.slug === slug)
  const [qty, setQty] = useState(1)
  const [unit, setUnit] = useState<Unit>('stk')
  useEffect(() => { if (p) { const u = defaultUnit(p); setUnit(u); setQty(u === 'm' ? 10 : 1) } }, [p])
  const { list } = useList()
  const onList = p ? list.lines.find((l) => l.sku === p.sku) : undefined

  if (error) return <div className="set-page"><p className="set-empty" role="alert">{t.error}</p></div>
  if (!cat) return <div className="set-page"><p className="set-empty" role="status">{t.loading}</p></div>
  if (!p) return <div className="set-page"><p className="set-empty">{t.none}</p><p className="set-wrap"><Link className="set-link" to={`${path(lang, 'home')}#vorur`}>{t.back}</Link></p></div>

  const f = FAMILIES.find((x) => x.n === p.fam)!
  const related = cat.products.filter((x) => x.leaf === p.leaf && x.id !== p.id).slice(0, 8)
  return (
    <div className="set-page">
      <nav className="set-crumbs" aria-label={lang === 'is' ? 'Brauðmolar' : 'Breadcrumb'}>
        <Link to={`${path(lang, 'home')}#vorur`}>{t.back}</Link><span aria-hidden="true">/</span>
        <Link to={path(lang, 'family', f.slug)}>{lang === 'is' ? f.is : f.en}</Link><span aria-hidden="true">/</span>
        <span>{p.leaf}</span>
      </nav>
      <div className="set-prod">
        <div className={`set-prod__img${p.img && p.white === false ? ' is-tile' : ''}`} data-set-fade="">
          {p.img ? <img src={productImg(p.id)} alt={`${p.name}, ${t.sku.toLowerCase()} ${p.sku}`} width={480} height={480} /> : <><Placeholder /><span className="set-sr">{t.noImg}</span></>}
        </div>
        <div className="set-prod__info">
          <h1>{p.name}</h1>
          <p className="set-prod__sku">{t.sku} <b>{p.sku}</b> · {p.leaf}</p>
          {p.attrs.length > 0 && (
            <dl className="set-spec">
              {p.attrs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          )}
          <div className="set-buy">
            <div className="set-qty">
              <button type="button" onClick={() => setQty((x) => Math.max(1, x - 1))} aria-label={L.less}>−</button>
              <input inputMode="numeric" value={qty} onChange={(e) => setQty(Math.max(1, parseInt(e.target.value.replace(/\D/g, ''), 10) || 1))} aria-label={L.cols.qty} />
              <button type="button" onClick={() => setQty((x) => x + 1)} aria-label={L.more}>+</button>
            </div>
            <select className="set-select" value={unit} onChange={(e) => setUnit(e.target.value as Unit)} aria-label={L.units}>
              {UNITS.map((u) => <option key={u} value={u}>{UNIT_LABEL[lang][u]}</option>)}
            </select>
            <button type="button" className="set-btn" onClick={() => addProduct(p, qty, unit)}>
              {t.addToList}<Arrow />
            </button>
          </div>
          {onList && <p className="set-prod__on" aria-live="polite"><span aria-hidden="true" />{t.added}: {onList.qty} {UNIT_LABEL[lang][onList.unit]}</p>}
          <p className="set-prod__note">{T[lang].list.lead}</p>
          <div className="set-prod__links">
            <a className="set-link" href={p.url} target="_blank" rel="noopener">{lang === 'is' ? 'Varan á set.is' : 'This product on set.is'}</a>
            <a className="set-link" href={f.pdf} target="_blank" rel="noopener">{t.pdf}</a>
            {f.handbook && <a className="set-link" href={f.handbook} target="_blank" rel="noopener">{t.handbook}</a>}
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="set-related" aria-labelledby="set-rel-h">
          <h2 className="set-h" id="set-rel-h" data-set-words="">{p.leaf}</h2>
          <div className="set-grid">{related.map((x, i) => <ProductCard key={x.id} p={x} lang={lang} i={i % 4} />)}</div>
        </section>
      )}
    </div>
  )
}
