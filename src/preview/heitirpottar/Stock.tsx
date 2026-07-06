import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  ArrowLeft,
  Boxes,
  Flame,
  Package,
  Search,
  Snowflake,
  Store,
  Truck,
  Warehouse,
  Waves,
} from 'lucide-react'
import { Img } from '../../components/Img'
import { PreviewChrome } from '../PreviewChrome'
import { getPreviewCompany } from '../companies'
import {
  INVENTORY,
  STOCK_LOCATIONS,
  cdn,
  kr,
  productUrl,
  stockStatus,
  type StockItem,
  type StockStatus,
} from './data'

/*
 * Lagerstaða — owner back office for heitirpottar.is.
 * Same GUFA palette as the storefront (basalt #141210, steam #F3EEE7,
 * ember #F07B3C) so the shop and the back office feel like one product.
 * Every number below maps 1:1 to a Shopify InventoryLevel per Location.
 */

const company = getPreviewCompany('heitirpottar')

const STATUS: Record<StockStatus, { label: string; text: string; chip: string; dot: string }> = {
  ok: { label: 'Til á lager', text: 'text-[#8FCBA3]', chip: 'bg-[#8FCBA3]/12', dot: 'bg-[#8FCBA3]' },
  low: { label: 'Lítið eftir', text: 'text-[#F0B44E]', chip: 'bg-[#F0B44E]/12', dot: 'bg-[#F0B44E]' },
  out: { label: 'Uppselt', text: 'text-[#E4796B]', chip: 'bg-[#E4796B]/12', dot: 'bg-[#E4796B]' },
  incoming: { label: 'Væntanlegt', text: 'text-[#86A9CC]', chip: 'bg-[#86A9CC]/12', dot: 'bg-[#86A9CC]' },
}

/** Actionable first: what to reorder floats to the top. */
const SORT_WEIGHT: Record<StockStatus, number> = { out: 0, low: 1, incoming: 2, ok: 3 }

const CATEGORY_ICON: Record<string, typeof Package> = {
  Rafmagnspottar: Waves,
  Hitaveitupottar: Waves,
  Hitaveituskeljar: Waves,
  'Kaldir pottar': Snowflake,
  Saunahús: Flame,
  Infrarauðt: Flame,
  Aukahlutir: Package,
}

type Filter = 'all' | StockStatus

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Allt' },
  { key: 'ok', label: 'Til á lager' },
  { key: 'low', label: 'Lítið eftir' },
  { key: 'out', label: 'Uppselt' },
  { key: 'incoming', label: 'Væntanlegt' },
]

function Thumb({ item }: { item: StockItem }) {
  if (item.image) {
    return (
      <Img
        src={cdn(item.image, 96)}
        alt={item.title}
        className="h-11 w-11 shrink-0 rounded-lg bg-[#141210] object-cover"
        fallbackClassName="h-11 w-11 shrink-0 rounded-lg bg-[#141210]"
      />
    )
  }
  const Icon = CATEGORY_ICON[item.category] ?? Package
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F07B3C]/12 text-[#F07B3C]">
      <Icon size={18} strokeWidth={1.6} aria-hidden />
    </span>
  )
}

function StatusBadge({ status }: { status: StockStatus }) {
  const s = STATUS[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold ${s.chip} ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
      {s.label}
    </span>
  )
}

function Kpi({
  icon: Icon,
  value,
  label,
  tone = 'default',
}: {
  icon: typeof Package
  value: string
  label: string
  tone?: 'default' | 'low' | 'out' | 'incoming'
}) {
  const toneText =
    tone === 'low' ? 'text-[#F0B44E]' : tone === 'out' ? 'text-[#E4796B]' : tone === 'incoming' ? 'text-[#86A9CC]' : 'text-[#F3EEE7]'
  const iconWrap =
    tone === 'low'
      ? 'bg-[#F0B44E]/12 text-[#F0B44E]'
      : tone === 'out'
        ? 'bg-[#E4796B]/12 text-[#E4796B]'
        : tone === 'incoming'
          ? 'bg-[#86A9CC]/12 text-[#86A9CC]'
          : 'bg-[#F07B3C]/12 text-[#F07B3C]'
  return (
    <div className="rounded-2xl border border-white/10 bg-[#1D1A17] p-5">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconWrap}`}>
        <Icon size={17} strokeWidth={1.8} aria-hidden />
      </span>
      <p className={`mt-4 text-[26px] font-bold tabular-nums leading-none tracking-[-0.01em] ${toneText}`}>{value}</p>
      <p className="mt-2 text-[13px] font-medium text-[#A79E92]">{label}</p>
    </div>
  )
}

export default function HeitirpottarStock() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const rows = useMemo(
    () => INVENTORY.map((item) => ({ item, status: stockStatus(item), available: item.warehouse + item.shop })),
    [],
  )

  const totals = useMemo(() => {
    const units = rows.reduce((n, r) => n + r.available, 0)
    const warehouse = rows.reduce((n, r) => n + r.item.warehouse, 0)
    const shop = rows.reduce((n, r) => n + r.item.shop, 0)
    const incoming = rows.reduce((n, r) => n + r.item.incoming, 0)
    const value = rows.reduce((n, r) => n + r.available * r.item.price, 0)
    return {
      skus: rows.length,
      units,
      warehouse,
      shop,
      incoming,
      value,
      low: rows.filter((r) => r.status === 'low').length,
      out: rows.filter((r) => r.status === 'out').length,
      incomingCount: rows.filter((r) => r.status === 'incoming').length,
    }
  }, [rows])

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: rows.length, ok: 0, low: 0, out: 0, incoming: 0 }
    for (const r of rows) c[r.status] += 1
    return c
  }, [rows])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter((r) => (filter === 'all' ? true : r.status === filter))
      .filter((r) =>
        q === ''
          ? true
          : r.item.title.toLowerCase().includes(q) ||
            r.item.sku.toLowerCase().includes(q) ||
            r.item.category.toLowerCase().includes(q),
      )
      .sort((a, b) => SORT_WEIGHT[a.status] - SORT_WEIGHT[b.status] || a.item.title.localeCompare(b.item.title, 'is'))
  }, [rows, query, filter])

  const needsReorder = totals.out + totals.low

  const krShort = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} m.kr.`
      : `${Math.round(n / 1000).toLocaleString('de-DE')} þús. kr.`

  return (
    <div lang="is" className="min-h-[100svh] bg-[#141210] font-['Satoshi',sans-serif] text-[#F3EEE7] antialiased">
      <PreviewChrome company={company} />

      {/* top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#141210]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <div className="flex items-center gap-3">
            <Link
              to="/preview/heitirpottar"
              className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[12.5px] font-semibold text-[#E4DDD2] transition-colors hover:border-[#F07B3C] hover:text-[#F07B3C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F07B3C]"
            >
              <ArrowLeft size={14} strokeWidth={2.2} aria-hidden />
              <span className="hidden sm:inline">Vefurinn</span>
            </Link>
            <span className="font-['Clash_Display',sans-serif] text-[14px] font-semibold tracking-[0.12em] text-[#F3EEE7]">
              LAGERSTJÓRN
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#8FCBA3]/25 bg-[#8FCBA3]/10 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8FCBA3] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8FCBA3]" />
            </span>
            <span className="text-[12px] font-semibold text-[#8FCBA3]">Samstillt við Shopify</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-5 pb-24 pt-8 md:px-8 md:pt-10">
        {/* page heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-['Clash_Display',sans-serif] text-3xl font-semibold tracking-[-0.02em] text-[#F3EEE7] md:text-[40px]">
                Lagerstaða
              </h1>
              <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#A79E92]">
                Sýnishorn
              </span>
            </div>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[#A79E92]">
              Öll staða á einum stað — hvað er til á lager, hvað er í versluninni og hvað er í pöntun.
            </p>
          </div>
          <p className="text-[13px] text-[#7C7469]">
            {STOCK_LOCATIONS.length} staðsetningar · uppfært í rauntíma
          </p>
        </div>

        {/* KPIs */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-6">
          <Kpi icon={Boxes} value={String(totals.skus)} label="Vörur í kerfinu" />
          <Kpi icon={Package} value={totals.units.toLocaleString('de-DE')} label="Einingar til" />
          <Kpi icon={Warehouse} value={krShort(totals.value)} label="Verðmæti lagers" />
          <Kpi icon={AlertTriangle} value={String(totals.low)} label="Lítið eftir" tone="low" />
          <Kpi icon={AlertTriangle} value={String(totals.out)} label="Uppselt" tone="out" />
          <Kpi icon={Truck} value={totals.incoming.toLocaleString('de-DE')} label="Í pöntun" tone="incoming" />
        </div>

        {/* location split */}
        <div className="mt-4 grid gap-3 md:grid-cols-3 md:gap-4">
          <LocationCard icon={Warehouse} name="Lager · Fosshálsi 13" units={totals.warehouse} accent="#F07B3C" />
          <LocationCard icon={Store} name="Verslun (sölugólf)" units={totals.shop} accent="#F07B3C" />
          <LocationCard icon={Truck} name="Væntanlegt (í pöntun)" units={totals.incoming} accent="#86A9CC" />
        </div>

        {/* reorder banner */}
        {needsReorder > 0 && (
          <button
            type="button"
            onClick={() => setFilter(totals.out > 0 ? 'out' : 'low')}
            className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-[#F0B44E]/25 bg-[#F0B44E]/8 px-5 py-4 text-left transition-colors hover:bg-[#F0B44E]/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F0B44E]"
          >
            <AlertTriangle size={18} strokeWidth={2} aria-hidden className="shrink-0 text-[#F0B44E]" />
            <span className="text-[14px] font-medium text-[#EBE4D8]">
              <span className="font-bold text-[#F3EEE7]">{needsReorder} vörur</span> þarf að panta — smelltu til að sjá þær.
            </span>
          </button>
        )}

        {/* toolbar */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search size={16} strokeWidth={2} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C7469]" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Leita að vöru eða vörunúmeri…"
              aria-label="Leita í lager"
              className="w-full rounded-xl border border-white/12 bg-[#1D1A17] py-2.5 pl-10 pr-3.5 text-[14px] text-[#F3EEE7] placeholder:text-[#7C7469] outline-none transition-colors focus:border-[#F07B3C]/60"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Sía eftir stöðu">
            {FILTERS.map((f) => {
              const active = filter === f.key
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setFilter(f.key)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F07B3C] ${
                    active
                      ? 'border-[#F07B3C] bg-[#F07B3C] text-[#141210]'
                      : 'border-white/12 text-[#C9C0B4] hover:border-white/30 hover:text-[#F3EEE7]'
                  }`}
                >
                  {f.label}
                  <span className={`ml-1.5 tabular-nums ${active ? 'text-[#141210]/70' : 'text-[#7C7469]'}`}>{counts[f.key]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* table (md+) */}
        <div className="mt-4 hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
          <table className="w-full min-w-[880px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 bg-[#1D1A17] text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8A8177]">
                <th scope="col" className="py-3.5 pl-5 pr-3 font-semibold">Vara</th>
                <th scope="col" className="px-3 py-3.5 font-semibold">Flokkur</th>
                <th scope="col" className="px-3 py-3.5 text-right font-semibold">Lager</th>
                <th scope="col" className="px-3 py-3.5 text-right font-semibold">Verslun</th>
                <th scope="col" className="px-3 py-3.5 text-right font-semibold">Í pöntun</th>
                <th scope="col" className="px-3 py-3.5 text-right font-semibold">Til sölu</th>
                <th scope="col" className="px-3 py-3.5 font-semibold">Staða</th>
                <th scope="col" className="py-3.5 pl-3 pr-5 text-right font-semibold">Verð/eining</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(({ item, status, available }) => (
                <tr key={item.sku} className="border-b border-white/6 transition-colors last:border-0 hover:bg-white/[0.03]">
                  <td className="py-3 pl-5 pr-3">
                    <div className="flex items-center gap-3">
                      <Thumb item={item} />
                      <div className="min-w-0">
                        <a
                          href={productUrl(item.handle)}
                          target="_blank"
                          rel="noreferrer"
                          className="block truncate text-[14.5px] font-semibold text-[#F3EEE7] transition-colors hover:text-[#F07B3C] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F07B3C]"
                        >
                          {item.title}
                        </a>
                        <span className="text-[12px] tabular-nums text-[#7C7469]">{item.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-[13.5px] text-[#A79E92]">{item.category}</td>
                  <td className="px-3 py-3 text-right text-[14px] tabular-nums text-[#D9D2C7]">{item.warehouse}</td>
                  <td className="px-3 py-3 text-right text-[14px] tabular-nums text-[#D9D2C7]">{item.shop}</td>
                  <td className="px-3 py-3 text-right text-[14px] tabular-nums text-[#86A9CC]">{item.incoming || '—'}</td>
                  <td className="px-3 py-3 text-right text-[15px] font-bold tabular-nums text-[#F3EEE7]">{available}</td>
                  <td className="px-3 py-3"><StatusBadge status={status} /></td>
                  <td className="py-3 pl-3 pr-5 text-right text-[13.5px] tabular-nums text-[#C9C0B4]">{kr(item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {visible.length === 0 && <EmptyState />}
        </div>

        {/* cards (mobile) */}
        <div className="mt-4 space-y-3 md:hidden">
          {visible.map(({ item, status, available }) => (
            <div key={item.sku} className="rounded-2xl border border-white/10 bg-[#1D1A17] p-4">
              <div className="flex items-start gap-3">
                <Thumb item={item} />
                <div className="min-w-0 flex-1">
                  <a
                    href={productUrl(item.handle)}
                    target="_blank"
                    rel="noreferrer"
                    className="block truncate text-[15px] font-semibold text-[#F3EEE7]"
                  >
                    {item.title}
                  </a>
                  <span className="text-[12px] tabular-nums text-[#7C7469]">{item.sku} · {item.category}</span>
                </div>
                <StatusBadge status={status} />
              </div>
              <dl className="mt-3.5 grid grid-cols-4 gap-2 border-t border-white/8 pt-3.5 text-center">
                <Metric label="Lager" value={item.warehouse} />
                <Metric label="Verslun" value={item.shop} />
                <Metric label="Í pöntun" value={item.incoming} tone={item.incoming ? '#86A9CC' : undefined} />
                <Metric label="Til sölu" value={available} strong />
              </dl>
              <p className="mt-3 text-[13px] tabular-nums text-[#A79E92]">{kr(item.price)} / eining</p>
            </div>
          ))}
          {visible.length === 0 && <EmptyState />}
        </div>

        {/* disclosure */}
        <p className="mt-8 max-w-3xl text-[12.5px] leading-relaxed text-[#7C7469]">
          Sýnishorn af stjórnborði. Vöruheiti, flokkar og verð eru raunveruleg af heitirpottar.is; lagertölur eru dæmi.
          Í rekstri les hver tala hér beint úr Shopify — ein <span className="text-[#A79E92]">InventoryLevel</span> færsla
          fyrir hverja staðsetningu (Lager og Verslun) — svo talan á vefnum, í búðarkassanum og hér er alltaf sú sama.
        </p>
      </main>
    </div>
  )
}

function LocationCard({
  icon: Icon,
  name,
  units,
  accent,
}: {
  icon: typeof Package
  name: string
  units: number
  accent: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#1D1A17] px-5 py-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${accent}1f`, color: accent }}>
        <Icon size={18} strokeWidth={1.8} aria-hidden />
      </span>
      <div>
        <p className="text-[13px] font-medium text-[#A79E92]">{name}</p>
        <p className="text-[20px] font-bold tabular-nums text-[#F3EEE7]">
          {units.toLocaleString('de-DE')} <span className="text-[13px] font-medium text-[#7C7469]">einingar</span>
        </p>
      </div>
    </div>
  )
}

function Metric({ label, value, strong, tone }: { label: string; value: number; strong?: boolean; tone?: string }) {
  return (
    <div>
      <dt className="text-[11px] font-medium uppercase tracking-[0.06em] text-[#7C7469]">{label}</dt>
      <dd
        className={`mt-1 tabular-nums ${strong ? 'text-[16px] font-bold text-[#F3EEE7]' : 'text-[15px] font-semibold text-[#D9D2C7]'}`}
        style={tone ? { color: tone } : undefined}
      >
        {value}
      </dd>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 px-5 py-16 text-center">
      <Search size={22} strokeWidth={1.6} aria-hidden className="text-[#7C7469]" />
      <p className="text-[14px] font-medium text-[#A79E92]">Engar vörur passa við leitina.</p>
    </div>
  )
}
