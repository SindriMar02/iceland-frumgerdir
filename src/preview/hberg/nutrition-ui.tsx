import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { KATALOGUR } from './katalogur'
import { NAERING, NUTRITION_COLUMNS, nutritionSort, nutritionValue, type NutritionSort } from './naering'
import { SettIPoka } from './poki'
import { pop } from './popup'
import { PK } from './vorur'
import { ScrollArrows } from './scroll-arrows'
import { MOTION } from './experience-style'

export function writeNutritionUrl(sort: NutritionSort, desc: boolean, line: string, search: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('naering', '1')
  url.searchParams.set('rada', sort === 'energyKj' ? 'orka' : sort)
  for (const [key, value] of [['att', desc ? 'nidur' : ''], ['lina', line], ['leit', search]]) {
    if (value) url.searchParams.set(key, value)
    else url.searchParams.delete(key)
  }
  window.history.replaceState(null, '', url)
}
const fold = (s: string) => s.toLocaleLowerCase('is').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae')

export function NutritionOverview({ sort: initialSort = 'energyKj', line: initialLine = '' }: { sort?: NutritionSort; line?: string }) {
  const id = useId()
  const [sort, setSort] = useState(initialSort)
  const [desc, setDesc] = useState(() => new URLSearchParams(window.location.search).get('att') === 'nidur')
  const [line, setLine] = useState(initialLine)
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get('leit') ?? '')
  const root = useRef<HTMLDivElement>(null)
  const before = useRef(new Map<string, number>())
  const animations = useRef<Animation[]>([])
  const capture = () => {
    animations.current.forEach(a => a.cancel())
    animations.current = []
    before.current.clear()
    root.current?.querySelectorAll<HTMLElement>('[data-nutrition-row]').forEach(el => {
      if (el.getClientRects().length) before.current.set(el.dataset.nutritionRow!, el.getBoundingClientRect().top)
    })
  }
  const rows = KATALOGUR.filter(g => !line || g.s === line).flatMap(g => g.items.map(v => ({ v, group: g.t })))
    .filter(({ v, group }) => fold(`${v.name.is} ${group}`).includes(fold(search.trim())))
    .sort((a, b) => {
      const x = NAERING[a.v.slug][sort], y = NAERING[b.v.slug][sort]
      if (x === null || y === null) return x === y ? a.v.name.is.localeCompare(b.v.name.is, 'is') : x === null ? 1 : -1
      return (x - y) * (desc ? -1 : 1) || a.v.name.is.localeCompare(b.v.name.is, 'is')
    })
  useEffect(() => { writeNutritionUrl(sort, desc, line, search) }, [sort, desc, line, search])
  useEffect(() => () => animations.current.forEach(a => a.cancel()), [])
  useLayoutEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.current?.querySelectorAll<HTMLElement>('[data-nutrition-row]').forEach(el => {
        const previous = before.current.get(el.dataset.nutritionRow!)
        if (previous === undefined || !el.getClientRects().length) return
        const delta = previous - el.getBoundingClientRect().top
        if (delta) animations.current.push(el.animate([{ transform: `translateY(${delta}px)` }, { transform: 'translateY(0)' }], { duration: MOTION.panel, easing: MOTION.out }))
      })
    }
    before.current.clear()
  }, [sort, desc, line, search])
  const chooseSort = (key: NutritionSort) => { capture(); setSort(key); setDesc(sort === key ? !desc : false) }
  const product = (v: typeof rows[number]['v']) => <button className="hb-nutProduct" onClick={() => pop.open({ k: 'vara', slug: v.slug })}>
    <span className="hb-nutThumb" style={{ background: v.tint }}>{v.hasPack ? <img src={PK(v.slug, 'pack', 's')} alt="" loading="lazy" width="36" height="44" /> : <span aria-hidden="true">{v.name.is[0]}</span>}</span><span>{v.name.is.replace(/[-–—]/g, ' ')}</span>
  </button>
  const add = (slug: string) => <span className="hb-nutAdd"><SettIPoka slug={slug} /></span>
  return <div className="hb-nutrition" ref={root}>
    <h2 className="hb-disp">Næringargildi</h2>
    <p>Allar vörur H-Berg, gildi í 100 g.</p>
    <p className="hb-allergenDisclaimer">Lestu alltaf á umbúðirnar. Hringdu í 565 6500 ef þú ert í vafa.</p>
    <div className="hb-nutTools"><label htmlFor={`${id}-search`}>Leita að vöru<input id={`${id}-search`} type="search" value={search} onChange={e => { capture(); setSearch(e.target.value) }} placeholder="Nafn vöru" /></label>
      <label className="hb-nutSort" htmlFor={`${id}-sort`}>Raða eftir<select id={`${id}-sort`} value={`${sort}:${desc ? 'desc' : 'asc'}`} onChange={e => { capture(); const [key, direction] = e.target.value.split(':'); setSort(nutritionSort(key)); setDesc(direction === 'desc') }}>
        {NUTRITION_COLUMNS.flatMap(c => [<option key={`${c.key}:asc`} value={`${c.key}:asc`}>{c.title} ↑</option>, <option key={`${c.key}:desc`} value={`${c.key}:desc`}>{c.title} ↓</option>])}
      </select></label></div>
    <div className="hb-nutChips" role="group" aria-label="Vörulínur">
      {[{s:'',t:'Allar vörur'}, ...KATALOGUR].map(g => <button key={g.s} aria-pressed={line === g.s} onClick={() => { capture(); setLine(g.s) }}>{g.t.replace(/[-–—]/g, ' ')}</button>)}
    </div>
    <p role="status">{rows.length} vörur</p>
    {!rows.length && <p>Engar vörur fundust. Prófaðu annað leitarorð eða aðra vörulínu.</p>}
    <ScrollArrows target=".hb-nutTable" />
    <div className="hb-nutTable"><table><caption className="hb-orderSr">Næringargildi allra vara í 100 g. Orka í kJ og kkal, önnur gildi í grömmum.</caption><thead><tr><th scope="col">Vara</th>{NUTRITION_COLUMNS.map(c => <th scope="col" key={c.key} className={sort === c.key ? 'sorted' : ''} aria-sort={sort === c.key ? desc ? 'descending' : 'ascending' : 'none'}><button onClick={() => chooseSort(c.key)}>{c.title}<span aria-hidden="true">{sort === c.key ? desc ? ' ↓' : ' ↑' : ' ↕'}</span></button></th>)}<th scope="col"><span className="hb-orderSr">Pöntun</span></th></tr></thead>
      <tbody>{rows.map(({v}) => <tr key={v.slug} data-nutrition-row={`table:${v.slug}`}><th scope="row">{product(v)}</th>{NUTRITION_COLUMNS.map(c => <td key={c.key} className={sort === c.key ? 'sorted' : ''}>{c.key === 'energyKj' ? <>{nutritionValue(v.slug,c.key).split(' / ')[0]}<small>{nutritionValue(v.slug,c.key).split(' / ')[1]}</small></> : nutritionValue(v.slug,c.key)}</td>)}<td>{add(v.slug)}</td></tr>)}</tbody>
    </table></div>
    <div className="hb-nutCards">{rows.map(({v}) => <article key={v.slug} data-nutrition-row={`card:${v.slug}`}><div className="hb-nutCardHead">{product(v)}{add(v.slug)}</div><dl>{NUTRITION_COLUMNS.map(c => <div key={c.key} className={sort === c.key ? 'sorted' : ''}><dt>{c.title}</dt><dd>{nutritionValue(v.slug,c.key)}</dd></div>)}</dl></article>)}</div>
  </div>
}
