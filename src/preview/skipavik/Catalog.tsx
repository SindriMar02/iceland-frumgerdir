import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FAMILIES, FEATURED, T, familyBySlug, firstLetter, img, isCompare, loadCatalog, pad2, path,
  type Catalog, type Family, type Lang, type Product,
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
    <span className="skv-ring" aria-hidden="true">
      <svg viewBox="0 0 44 44"><circle className="r-wall" cx="22" cy="22" r="19.5" /><circle className="r-bore" cx="22" cy="22" r="19.5" /><circle className="r-draw" cx="22" cy="22" r="19.5" pathLength={1} transform="rotate(-90 22 22)" /></svg>
      <svg className="r-arr" viewBox="0 0 14 14" style={{ position: 'relative', width: 14, height: 14, transform: `rotate(${rot}deg)` }}><path d="M2 7h10M8 3l4 4-4 4" /></svg>
    </span>
  )
}
/* a job with no matching photo shows its key published figure instead of a stand-in picture */
function Fact({ p, big = false }: { p: Product; big?: boolean }) {
  const [k, v] = p.attrs[0] ?? ['', '']
  const m = v.match(/^(\d+(?:,\d+)?(?:–\d+)?(?: til \d+(?:,\d+)?)?)(.*)$/)
  return (
    <span className={`skv-card__fact${big ? ' is-big' : ''}${m ? '' : ' is-text'}`}>
      <b>{m ? m[1] : v}</b>
      <span>{m && /^[a-zþæöð]/i.test(m[2].trim()) && !m[2].trim().startsWith('samkv') ? m[2].trim() : k}</span>
    </span>
  )
}

/* the division's own people, as skipavik.is lists them: a phone call stays one tap away */
export function People({ f, compact = false }: { f: Family; compact?: boolean }) {
  return (
    <ul className={`skv-people${compact ? ' is-compact' : ''}`}>
      {f.people.map((x) => (
        <li key={x.name}>
          <b>{x.name}</b><span>{x.role}</span>
          {x.tel && <a className="skv-link" href={`tel:+354${x.tel.replace(/\s/g, '')}`}>{x.tel}</a>}
          {!compact && x.email && <a className="skv-link" href={`mailto:${x.email}`}>{x.email}</a>}
        </li>
      ))}
    </ul>
  )
}

export function AddButton({ p, lang }: { p: Product; lang: Lang }) {
  const { list } = useList()
  const on = list.lines.some((l) => l.sku === p.sku)
  const t = T[lang].cat
  return (
    <button type="button" className={`skv-add${on ? ' is-on' : ''}`} onClick={() => addProduct(p)} aria-label={`${on ? t.added : t.add}: ${p.name} (${p.sku})`} title={on ? t.added : t.add}>
      {on
        ? <svg key="on" viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8.5 3.2 3L13 4.5" /></svg>
        : <svg key="off" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3v10M3 8h10" /></svg>}
    </button>
  )
}

export function ProductCard({ p, lang, i = 0 }: { p: Product; lang: Lang; i?: number }) {
  const t = T[lang].cat
  return (
    <article className="skv-card" data-skv-fade="" data-skv-i={i}>
      <p className="skv-card__leaf">{p.leaf}</p>
      <div className={`skv-card__img${p.img ? ' is-tile' : ''}`}>
        {p.img && p.photo
          ? <img src={img(p.photo, 800)} alt={p.alt ?? p.name} loading="lazy" decoding="async" width={800} height={600} />
          : <Fact p={p} />}
      </div>
      <h3 className="skv-card__name"><Link to={path(lang, 'product', p.slug)}>{p.name}</Link></h3>
      <div className="skv-card__foot">
        <span className="skv-card__sku">{t.sku} {p.sku}</span>
        {p.req ? <AddButton p={p} lang={lang} /> : <Link className="skv-link" to={path(lang, 'product', p.slug)} aria-label={`${t.view}: ${p.name}`}>{t.view}</Link>}
      </div>
    </article>
  )
}
function SkeletonCards({ n = 3 }: { n?: number }) {
  return <>{Array.from({ length: n }, (_, i) => <div key={i} className="skv-card skv-card--skel" aria-hidden="true" />)}</>
}

/* pick three to represent a family: products with Set's own photo, from different sub-families first */
function featured(ps: Product[], fam: number, n = 3): Product[] {
  const withImg = ps.filter((p) => p.img)
  const out: Product[] = (FEATURED[fam] ?? []).flatMap((sku) => ps.filter((p) => p.sku === sku))
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
    <div className="skv-search" role="search">
      <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4.5 4.5" /></svg>
      <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={t.search} aria-label={t.search} enterKeyHint="search" />
    </div>
  )
}
function ViewToggle({ lang, mode, setMode }: { lang: Lang; mode: 'grid' | 'az'; setMode: (m: 'grid' | 'az') => void }) {
  const t = T[lang].cat
  return (
    <div className="skv-toggle" role="group" aria-label={lang === 'is' ? 'Framsetning' : 'Layout'}>
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
  if (!products.length) return <p className="skv-empty">{t.none}</p>
  const id = (k: string) => `skv-az-${encodeURIComponent(k)}`
  return (
    <div className="skv-az">
      <nav className="skv-az__jump" aria-label={t.jump}>
        {groups.map(([k]) => <a key={k} href={`#${id(k)}`} onClick={(e) => { e.preventDefault(); document.getElementById(id(k))?.scrollIntoView({ block: 'start' }) }}>{k}</a>)}
      </nav>
      {groups.map(([k, ps]) => (
        <section key={k} className="skv-az__group" id={id(k)} aria-labelledby={`${id(k)}-h`}>
          <h3 className="skv-az__letter skv-d" id={`${id(k)}-h`}>{k}</h3>
          <ul className="skv-az__rows">
            {ps.map((p) => (
              <li key={p.id} className="skv-az__row">
                <span className="skv-az__sku">{p.sku}</span>
                <Link to={path(lang, 'product', p.slug)}>{p.name}</Link>
                <span className="skv-az__leaf">{p.leaf}</span>
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

  const filtered = useMemo(() => (cat ? cat.products.filter((p) => (!shown.fam || p.fam === shown.fam) && matches(p, shown.q)) : []), [cat, shown])
  const famList = FAMILIES.filter((f) => !shown.fam || f.n === shown.fam)
  const searching = !!shown.q

  return (
    <section className="skv-cat" id="svid" aria-labelledby="skv-cat-h">
      <div className="skv-cat__head">
        <h2 className="skv-d skv-d--xl" id="skv-cat-h" data-skv-mask="" data-skv-fit="">{t.title}</h2>
        {cat && <p className="skv-cat__lead" data-skv-fade="">{t.lead(cat.products.length)}</p>}
      </div>
      <div className="skv-dots" aria-hidden="true" />
      <div className="skv-filter">
        <label>
          <span>{t.filter}:</span>
          <select className="skv-select" value={fam} onChange={(e) => setFam(Number(e.target.value))}>
            <option value={0}>{t.all}</option>
            {FAMILIES.map((f) => <option key={f.n} value={f.n}>{pad2(f.n)} {lang === 'is' ? f.is : f.en}</option>)}
          </select>
        </label>
        <SearchBox lang={lang} value={q} onChange={setQ} />
        {cat && (searching || mode === 'az') && <span className="skv-filter__count" aria-live="polite">{t.results(filtered.length)}</span>}
        <ViewToggle lang={lang} mode={mode} setMode={setMode} />
      </div>
      <div className={`skv-stage${swapping ? ' is-swapping' : ''}`}>
        {error && <p className="skv-empty" role="alert">{t.error}</p>}
        {shown.mode === 'az' && cat
          ? <AZList lang={lang} products={filtered} />
          : famList.map((f) => {
              const ps = cat ? filtered.filter((p) => p.fam === f.n) : []
              if (cat && !ps.length) return null
              const meta = cat?.families.find((x) => x.n === f.n)
              const cards = searching ? ps.slice(0, 3) : featured(ps, f.n)
              return (
                <article className="skv-row" key={f.n} aria-labelledby={`skv-fam-${f.n}`}>
                  <div className="skv-row__text">
                    <p className="skv-row__n skv-tnum">{pad2(f.n)}</p>
                    <h3 className="skv-h" id={`skv-fam-${f.n}`} data-skv-words="">{lang === 'is' ? f.is : f.en}</h3>
                    <p className="skv-row__desc">{f.desc[lang]}</p>
                    {meta && <p className="skv-row__meta">{searching ? t.results(ps.length) : `${f.place} · ${t.inSample(ps.length)}`}</p>}
                    <div className="skv-row__links">
                      <Link className="skv-ringlink" to={path(lang, 'family', f.slug)}><Ring />{t.viewAll}<span className="skv-sr"> {lang === 'is' ? f.is : f.en}</span></Link>
                      <span className="skv-row__docs">
                        {f.people.slice(0, 1).map((x) => x.tel && <a key={x.name} className="skv-link" href={`tel:+354${x.tel.replace(/\s/g, '')}`}>{t.call}: {x.name.split(' ')[0]}, {x.tel}</a>)}
                      </span>
                    </div>
                  </div>
                  <div className="skv-row__cards">
                    {cat ? cards.map((p, i) => <ProductCard key={p.id} p={p} lang={lang} i={i} />) : <SkeletonCards />}
                  </div>
                </article>
              )
            })}
        {cat && shown.mode === 'grid' && !filtered.length && <p className="skv-empty">{t.none}</p>}
        {!cat && !error && <p className="skv-sr" role="status">{t.loading}</p>}
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
    <div className="skv-page">
      <nav className="skv-crumbs" aria-label={lang === 'is' ? 'Brauðmolar' : 'Breadcrumb'}>
        <Link to={`${path(lang, 'home')}#svid`}>{t.back}</Link><span aria-hidden="true">/</span><span>{pad2(f.n)} {name}</span>
      </nav>
      <div className="skv-fam__head">
        <h1 className="skv-d skv-d--l" data-skv-mask="" data-skv-fit="">{name}</h1>
      </div>
      <div className="skv-fam__intro">
        <p className="skv-lede" data-skv-fade="">{f.desc[lang]}</p>
        <div>
          <p className="skv-label" style={{ marginBottom: 10 }}>{f.place}</p>
          <People f={f} />
          <a className="skv-link" href={f.page} target="_blank" rel="noopener">{t.onSite}</a>
        </div>
      </div>
      <div className="skv-dots" style={{ margin: '40px var(--gut) 0' }} aria-hidden="true" />
      <div ref={top} style={{ scrollMarginTop: 'calc(var(--bar) + 8px)' }} />
      {meta && meta.subs.length > 1 && (
        <div className="skv-tabs" role="group" aria-label={t.sub} style={{ paddingTop: 12 }}>
          <button type="button" aria-pressed={!sub} onClick={() => setSub('')}>{t.allSubs}<sup>{all.length}</sup></button>
          {meta.subs.map(([s, n]) => <button key={s} type="button" aria-pressed={sub === s} onClick={() => setSub(s)}>{s}<sup>{n}</sup></button>)}
        </div>
      )}
      <div className="skv-filter">
        <SearchBox lang={lang} value={q} onChange={setQ} />
        {cat && <span className="skv-filter__count" aria-live="polite">{t.results(list.length)}</span>}
        <ViewToggle lang={lang} mode={mode} setMode={setMode} />
      </div>
      <div className={`skv-stage${swapping ? ' is-swapping' : ''}`}>
        {error && <p className="skv-empty" role="alert">{t.error}</p>}
        {!cat && !error && <div className="skv-grid"><SkeletonCards n={8} /></div>}
        {cat && shown.mode === 'az' && <AZList lang={lang} products={list} />}
        {cat && shown.mode === 'grid' && (list.length
          ? <div className="skv-grid">{slice.map((p, i) => <ProductCard key={p.id} p={p} lang={lang} i={i % 4} />)}</div>
          : <p className="skv-empty">{t.none}</p>)}
        {cat && shown.mode === 'grid' && pages > 1 && (
          <nav className="skv-pager" aria-label={t.page}>
            <button type="button" onClick={() => go(cur - 1)} disabled={cur === 1} aria-label={t.prev}><Ring dir="left" /></button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button key={n} type="button" className="skv-pager__n" aria-current={n === cur ? 'page' : undefined} onClick={() => go(n)} aria-label={`${t.page} ${n}`}>{n}</button>
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
  const { cat, error } = useCatalog()
  const p = cat?.products.find((x) => x.slug === slug)
  const { list } = useList()
  const onList = p ? list.lines.find((l) => l.sku === p.sku) : undefined

  if (error) return <div className="skv-page"><p className="skv-empty" role="alert">{t.error}</p></div>
  if (!cat) return <div className="skv-page"><p className="skv-empty" role="status">{t.loading}</p></div>
  if (!p) return <div className="skv-page"><p className="skv-empty">{t.none}</p><p className="skv-wrap"><Link className="skv-link" to={`${path(lang, 'home')}#svid`}>{t.back}</Link></p></div>

  const f = FAMILIES.find((x) => x.n === p.fam)!
  const related = cat.products.filter((x) => x.leaf === p.leaf && x.id !== p.id).slice(0, 8)
  return (
    <div className="skv-page">
      <nav className="skv-crumbs" aria-label={lang === 'is' ? 'Brauðmolar' : 'Breadcrumb'}>
        <Link to={`${path(lang, 'home')}#svid`}>{t.back}</Link><span aria-hidden="true">/</span>
        <Link to={path(lang, 'family', f.slug)}>{lang === 'is' ? f.is : f.en}</Link><span aria-hidden="true">/</span>
        <span>{p.leaf}</span>
      </nav>
      <div className="skv-prod">
        <div className={`skv-prod__img${p.img ? ' is-tile' : ''}`} data-skv-fade="">
          {p.img && p.photo ? <img src={img(p.photo, 1600)} alt={p.alt ?? p.name} width={1600} height={1200} /> : <Fact p={p} big />}
        </div>
        <div className="skv-prod__info">
          <h1>{p.name}</h1>
          <p className="skv-prod__sku">{lang === 'is' ? f.is : f.en} · {p.leaf}</p>
          {p.attrs.length > 0 && (
            <dl className="skv-spec">
              {p.attrs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          )}
          {p.req && (
            <div className="skv-buy">
              <button type="button" className="skv-btn" onClick={() => addProduct(p, 1, 'verk')} disabled={!!onList}>
                {onList ? t.added : t.addToList}<Arrow />
              </button>
            </div>
          )}
          {onList && <p className="skv-prod__on" aria-live="polite"><span aria-hidden="true" />{t.added}</p>}
          {p.req && <p className="skv-prod__note">{T[lang].list.lead}</p>}
          <People f={f} compact />
          <div className="skv-prod__links">
            <a className="skv-link" href={p.url} target="_blank" rel="noopener">{p.src ? `${t.source}: ${p.src}` : t.onSite}</a>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="skv-related" aria-labelledby="skv-rel-h">
          <h2 className="skv-h" id="skv-rel-h" data-skv-words="">{p.leaf}</h2>
          <div className="skv-grid">{related.map((x, i) => <ProductCard key={x.id} p={x} lang={lang} i={i % 4} />)}</div>
        </section>
      )}
    </div>
  )
}
