/**
 * Published CMS content hydrates the bundled/prerendered site. Missing fields
 * fall back individually; explicitly empty collections remain empty.
 * Presentation reads drafts through the separate authenticated preview Worker.
 * Draft credentials stay server-side; polling and stega support live editing.
 */
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import type { DateException } from './availability'
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {
  FEATURE_IMG, PRODUCT_IMG, SHOP_IMG, MENU_ART, CAKE_ART, STORY_ART,
  BREAD,
  CAKES,
  FEATURE,
  GALLERY,
  HOURS_BY_DAY,
  LINKS,
  MENU,
  REVIEWS,
  T,
  type GalleryPhoto,
  type Lang,
  type MenuItem,
  type Review,
} from './data'
import {
  ORDER_T, ORDER_EXTRAS, type OrderExtra,
  isProductOrderable,
  OCCASIONS,
  type Occasion,
  ORDER_PRODUCTS,
  PICKUP_LOCATIONS,
  type Bilingual,
  type OrderChoice,
  type OrderGroup,
  type OrderProduct,
} from './order'

/* ── Preview detection ──────────────────────────────────────────────────── */
// Preview requests use an HttpOnly session on the dedicated preview host.
// No draft-read credential is ever bundled into the website.
const isPreview = typeof window !== 'undefined' &&
  (new URLSearchParams(window.location.search).has('preview') || window.self !== window.top)

const client = createClient({
  projectId: 'v4v3s4wg',
  dataset: 'production',
  apiVersion: '2025-08-15',
  useCdn: false,
  perspective: 'published',
})

const builder = imageUrlBuilder({ projectId: 'v4v3s4wg', dataset: 'production' })

type RawImg = { asset?: { _ref?: string }; hotspot?: { x?: number; y?: number } } | null | undefined
/** A CMS gallery upload, rendered at both sizes the tile/lightbox pair needs.
 *  Falls back to the bundled frame whole — never half-CMS, half-bundle. */
function mkGalleryPic(img: RawImg, fallback: GalleryPhoto): { src: string; srcSm: string; w: number; h: number } {
  if (!img?.asset?._ref) return { src: fallback.src, srcSm: fallback.srcSm, w: fallback.w, h: fallback.h }
  const at = (w: number) => builder.image(img).width(w).quality(80).auto('format').url()
  const dimensions = /-(\d+)x(\d+)-/.exec(img.asset._ref)
  return { src: at(2000), srcSm: at(800), w: dimensions ? Number(dimensions[1]) : fallback.w, h: dimensions ? Number(dimensions[2]) : fallback.h }
}

/** A CMS product photo, square to match the bundled crops. */
function mkProductPic(img: RawImg): string | undefined {
  if (!img?.asset?._ref) return undefined
  return builder.image(img).width(1400).height(1400).fit('crop').quality(84).auto('format').url()
}

/* ── Hours: 7-entry array (0=Sun..6=Sat), minutes-from-midnight, matches
   data.ts's HOURS_BY_DAY shape exactly so openStatus() needs no changes
   beyond taking it as a live value instead of a static import. ──────────── */
export interface DayHours {
  open: number
  close: number
  closed?: boolean
}

const pad2 = (n: number) => String(n).padStart(2, '0')
const fmtHM = (mins: number) => `${Math.floor(mins / 60)}:${pad2(mins % 60)}`
const hm = (s: string | undefined, fb: number): number => {
  const m = /^(\d{1,2}):(\d{2})$/.exec((s || '').trim())
  return m && Number(m[1]) < 24 && Number(m[2]) < 60 ? Number(m[1]) * 60 + Number(m[2]) : fb
}

const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
/** Display order Mon..Sun (matches the original bundled copy), as indices into the 0=Sun..6=Sat array. */
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0]
const DAY_ABBR: Record<Lang, string[]> = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  is: ['Mán', 'Þri', 'Mið', 'Fim', 'Fös', 'Lau', 'Sun'],
}

/** One printed hours line, kept as two fields rather than one string: the
 *  visit strip lays the day out opposite the time, and splitting a joined
 *  string on its first space silently mangles any multi-word day label
 *  ("Every day 7:00 to 17:00" → "Every" / "day 7:00 to 17:00"). */
export interface HoursRow {
  label: string
  value: string
}

/** Groups consecutive days sharing identical hours into one line — "Every day
 *  7:00 to 17:00" when the whole week matches, otherwise "Mon to Sat …" plus
 *  the exceptions. Generated FROM the live hours so the printed text and the
 *  live open/closed badge can never disagree (a two-source-of-truth
 *  trust-breaker, see cms-setup-sanity memory's editability-audit lesson). */
function buildHoursRows(days: readonly DayHours[], lang: Lang): HoursRow[] {
  const to = lang === 'en' ? 'to' : 'til'
  const value = (h: DayHours) =>
    h.closed ? (lang === 'en' ? 'Closed' : 'Lokað') : `${fmtHM(h.open)} ${to} ${fmtHM(h.close)}`

  const rows: HoursRow[] = []
  let i = 0
  while (i < DISPLAY_ORDER.length) {
    const h = days[DISPLAY_ORDER[i]]
    let j = i
    while (j + 1 < DISPLAY_ORDER.length) {
      const next = days[DISPLAY_ORDER[j + 1]]
      if (next.open === h.open && next.close === h.close && !!next.closed === !!h.closed) j++
      else break
    }
    // The whole week on one schedule reads better as "Every day" than "Mon to Sun".
    const label =
      i === 0 && j === DISPLAY_ORDER.length - 1
        ? lang === 'en' ? 'Every day' : 'Alla daga'
        : i === j
          ? DAY_ABBR[lang][i]
          : `${DAY_ABBR[lang][i]} ${to} ${DAY_ABBR[lang][j]}`
    rows.push({ label, value: value(h) })
    i = j + 1
  }
  return rows
}

/* ── Merged content shape ────────────────────────────────────────────────── */
export interface SiteContent {
  LINKS: typeof LINKS
  HOURS_BY_DAY: readonly DayHours[]
  hoursRows: Record<Lang, HoursRow[]>
  ORDER_EXTRAS: OrderExtra[]
  VEISLUKJOR: {threshold: number; discountPct: number; nudgeFrom: number}
  textOverrides: Record<string, Bilingual>
  images: Record<string, {src: string; caption: Bilingual}>
  ordersPaused: boolean
  ordersPauseMessage: Bilingual
  dateExceptions: DateException[]
  mainName: string
  trustLine: Bilingual
  heroTitle: Bilingual
  heroSub: Bilingual
  heroLine: Bilingual
  heroPhotoCaption: Bilingual
  statementQuote: Bilingual
  statementWho: Bilingual
  storyP1: Bilingual
  storyP2: Bilingual
  FEATURE: MenuItem
  MENU: MenuItem[]
  BREAD: MenuItem[]
  CAKES: MenuItem[]
  REVIEWS: Review[]
  GALLERY: GalleryPhoto[]
  ORDER_PRODUCTS: OrderProduct[]
  OCCASIONS: Occasion[]
  PICKUP_LOCATIONS: { id: string; label: Bilingual }[]
}

const FALLBACK: SiteContent = {
  LINKS,
  HOURS_BY_DAY,
  // Generated from HOURS_BY_DAY, never typed out separately — so the printed
  // hours and the live open/closed badge cannot drift apart.
  hoursRows: { en: buildHoursRows(HOURS_BY_DAY, 'en'), is: buildHoursRows(HOURS_BY_DAY, 'is') },
  ORDER_EXTRAS: ORDER_EXTRAS.map(e => ({...e, kjorPrice: e.unitPrice, bulkAt: Infinity})),
  VEISLUKJOR: {threshold: Infinity, discountPct: 0, nudgeFrom: Infinity},
  textOverrides: {},
  images: {},
  ordersPaused: false,
  ordersPauseMessage: {is: 'Lokað er fyrir sérpantanir á vefnum í bili. Hafðu samband við okkur í síma.', en: 'Online custom orders are paused. Please call the bakery.'},
  dateExceptions: [],
  mainName: T.en.mainName,
  trustLine: { en: T.en.trustLine, is: T.is.trustLine },
  heroTitle: { en: T.en.heroTitle, is: T.is.heroTitle },
  heroSub: { en: T.en.heroSub, is: T.is.heroSub },
  heroLine: { en: T.en.heroLine, is: T.is.heroLine },
  heroPhotoCaption: { en: T.en.heroPhotoCaption, is: T.is.heroPhotoCaption },
  statementQuote: { en: T.en.statementQuote, is: T.is.statementQuote },
  statementWho: { en: T.en.statementWho, is: T.is.statementWho },
  storyP1: { en: T.en.storyP1, is: T.is.storyP1 },
  storyP2: { en: T.en.storyP2, is: T.is.storyP2 },
  FEATURE,
  MENU,
  BREAD,
  CAKES,
  REVIEWS,
  GALLERY,
  ORDER_PRODUCTS,
  OCCASIONS,
  PICKUP_LOCATIONS,
}

/* ── GROQ: everything editable, in one round trip ───────────────────────── */
export { QUERY } from './content-query'
import { QUERY } from './content-query'

/* eslint-disable @typescript-eslint/no-explicit-any */
const pick = (v: string | undefined, fb: string) => (v && v.trim() ? v : fb)
const biPick = (v: { is?: string; en?: string } | undefined, fb: Bilingual): Bilingual => ({
  en: pick(v?.en, fb.en),
  is: pick(v?.is, fb.is),
})
const biSelf = (v: { is?: string; en?: string } | undefined): Bilingual => ({
  en: (v?.en || v?.is || '').trim(),
  is: (v?.is || v?.en || '').trim(),
})

function mergeOrderProducts(raw: any[]): OrderProduct[] {
  return raw
    .map((d): OrderProduct => ({
      id: String(d.id || ''),
      name: biSelf(d.name),
      blurb: biSelf(d.blurb),
      basePrice: typeof d.basePrice === 'number' ? d.basePrice : 0,
      // A per-person rate of 0 is not a rate, it is an empty field. Treated as
      // absent so the product falls back to basePrice instead of pricing every
      // size at nothing.
      pricePerPerson:
        typeof d.pricePerPerson === 'number' ? d.pricePerPerson : undefined,
      sizeGroupId: d.sizeGroupId ? String(d.sizeGroupId) : undefined,
      compositionGroupId: d.compositionGroupId ? String(d.compositionGroupId) : undefined,
      composition: Array.isArray(d.composition)
        ? d.composition
            .filter((l: any) => l?.id && (l.label?.is || l.label?.en))
            .map((l: any) => ({ id: String(l.id), label: biSelf(l.label) }))
        : undefined,
      // CMS photo when uploaded, otherwise the bundled crop for a product we
      // already ship one for. A brand-new product with neither still renders.
      image: mkProductPic(d.image) ?? ORDER_PRODUCTS.find((p) => p.id === String(d.id || ''))?.image,
      noticeMode: d.noticeMode === 'calendarDays' ? 'calendarDays' : 'hours',
      leadDays: typeof d.leadDays === 'number' ? d.leadDays : 0,
      inscription: d.inscription?.label
        ? {
            label: biSelf(d.inscription.label),
            placeholder: biSelf(d.inscription.placeholder),
            maxLength: typeof d.inscription.maxLength === 'number' ? d.inscription.maxLength : 40,
          }
        : undefined,
      groups: Array.isArray(d.groups)
        ? d.groups.map((g: any): OrderGroup => ({
            id: String(g.id || ''),
            kind: g.kind === 'multi' ? 'multi' : 'single',
            label: biSelf(g.label),
            help: g.help ? biSelf(g.help) : undefined,
            // Opt IN, never out. `!== false` made every group whose flag was
            // simply absent compulsory, which is how the allergy question
            // ended up marked REQUIRED: nobody has to have an allergy.
            required: g.required === true,
            max: typeof g.max === 'number' ? g.max : undefined,
            layout: g.layout === 'grid' || g.layout === 'select' ? g.layout : undefined,
            choices: Array.isArray(g.choices)
              ? g.choices.map((c: any): OrderChoice => ({
                  id: String(c.id || ''),
                  label: biSelf(c.label),
                  priceDelta: typeof c.priceDelta === 'number' ? c.priceDelta : 0,
                  note: c.note ? biSelf(c.note) : undefined,
                  serves: typeof c.serves === 'number' && c.serves > 0 ? c.serves : undefined,
                  /* Same guard as `serves`, for the same reason: a size price
                     of 0 is an empty field in the studio, not a free cake. */
                  price: typeof c.price === 'number' && c.price > 0 ? c.price : undefined,
                  quoteOnly: c.quoteOnly === true,
                  adds: Array.isArray(c.adds)
                    ? c.adds.filter((a: any) => a?.is || a?.en).map((a: any) => biSelf(a))
                    : undefined,
                  // A swap with no target layer would silently replace nothing.
                  swap: c.swap?.layerId
                    ? { layerId: String(c.swap.layerId), label: biSelf(c.swap.label) }
                    : undefined,
                  needsPhoto: c.needsPhoto === true,
                  freeText: c.freeText?.label
                    ? {
                        label: biSelf(c.freeText.label),
                        placeholder: biSelf(c.freeText.placeholder),
                        maxLength:
                          typeof c.freeText.maxLength === 'number' ? c.freeText.maxLength : 120,
                      }
                    : undefined,
                }))
              : [],
          }))
        : [],
    }))
    .filter((p) => p.id && (p.name.en || p.name.is) && isProductOrderable(p))
}

/* Exported so the CMS behaviour can be exercised directly in tests: what the
 * site does with a missing document, a cleared field, a half-deleted list or a
 * malformed payload is exactly what decides whether an owner editing content
 * can break the page. See tools/reynir-cms-scenarios.mjs. */
export function merge(raw: any): SiteContent {
  const s = raw?.settings
  const linksMerged = {
    ...LINKS,
    phone: s?.phoneHref || LINKS.phone,
    phoneLabel: s?.phoneDisplay || LINKS.phoneLabel,
    email: s?.email || LINKS.email,
    orderEmail: s?.orderEmail || LINKS.orderEmail,
    facebook: s?.facebook || LINKS.facebook,
    instagram: s?.instagram || LINKS.instagram,
    order: s?.ahaUrl || LINKS.order,
    wolt: s?.woltUrl || LINKS.wolt,
  }

  const h = raw?.hours
  const hoursByDay: DayHours[] = h
    ? DAY_KEYS.map((key, i) => {
        const d = h[key]
        const fb = HOURS_BY_DAY[i]
        if (!d) return {...fb}
        const open = hm(d.open, -1), close = hm(d.close, -1)
        return {open, close, closed: !!d.closed || open < 0 || close <= open}
      })
    : [...FALLBACK.HOURS_BY_DAY]

  const menuItems: any[] = Array.isArray(raw?.menuItems) ? raw.menuItems : []
  const byCategory = (cat: string): MenuItem[] =>
    menuItems
      .filter((m) => m.category === cat)
      .map((m): MenuItem => ({
        name: String(m.name || ''),
        price: String(m.price || ''),
        tag: m.tag && (m.tag.en || m.tag.is) ? biSelf(m.tag) : undefined,
        desc: biSelf(m.desc),
      }))
      .filter((m) => m.name)
  const featuredList = byCategory('featured')
  const menu = byCategory('menu')
  const bread = byCategory('bread')
  const cakes = byCategory('cakes')

  const reviews: Review[] = Array.isArray(raw?.reviews)
    ? raw.reviews
        .map((d: any): Review => ({ quote: biSelf(d.quote), who: String(d.who || '') }))
        .filter((r: Review) => r.who && (r.quote.en || r.quote.is))
    : REVIEWS

  const gallery: GalleryPhoto[] = Array.isArray(raw?.gallery)
    ? raw.gallery.map((g: any, i: number) => {
        const fb = GALLERY[i % GALLERY.length]
        const pic = mkGalleryPic(g?.image, fb)
        return { src: pic.src, srcSm: pic.srcSm, w: pic.w, h: pic.h, caption: g?.caption ? biSelf(g.caption) : fb.caption }
      })
    : GALLERY

  const orderProducts = mergeOrderProducts(Array.isArray(raw?.orderProducts) ? raw.orderProducts : [])
  /* Merged PER AUDIENCE, not wholesale.
   *
   * The studio's occasions predate the person/company split and are all
   * company ones, so a wholesale replace would hand the private half an empty
   * list — and an empty list hides the step entirely. The feature would have
   * been invisible on the live site with nothing to show for it, which is the
   * same shape of fault as the order catalogue needing a seed.
   *
   * So each half falls back on its own: the owner can rewrite either list from
   * the studio, and the half he has not touched keeps working. An occasion
   * saved without an audience is treated as a company one, which is what every
   * existing document is. */
  const occasions = (() => {
    const fromCms = Array.isArray(raw?.occasions)
      ? raw.occasions
          .map((o: any) => ({
            id: String(o.id || ''),
            label: biSelf(o.label),
            audience: o.audience === 'person' ? ('person' as const) : ('company' as const),
            freeText: o.freeText === true,
            suggests: o.suggests && (o.suggests.is || o.suggests.en) ? biSelf(o.suggests) : undefined,
          }))
          .filter((o: any) => o.id && (o.label.en || o.label.is))
      : []
    return (['person', 'company'] as const).flatMap((aud) => {
      const mine = fromCms.filter((o: any) => o.audience === aud)
      if (s?.[aud === 'person' ? 'hidePersonalOccasions' : 'hideCompanyOccasions'] === true || (Array.isArray(raw?.occasions) && raw.occasions.length === 0)) return []
      return mine.length ? mine : OCCASIONS.filter((o) => o.audience === aud)
    })
  })()
  const pickupLocations = Array.isArray(raw?.pickupLocations)
    ? raw.pickupLocations.map((l: any) => ({ id: String(l.id || ''), label: biSelf(l.label) })).filter((l: any) => l.id && (l.label.en || l.label.is))
    : PICKUP_LOCATIONS

  const priceNumber = (value: unknown) => {
    const match = /^([\d. ]+)\s*(?:kr\.?)?$/.exec(String(value ?? '').trim())
    return match ? Number(match[1].replace(/[. ]/g, '')) : NaN
  }
  const extras: OrderExtra[] = Array.isArray(s?.orderExtras) ? s.orderExtras.map((e: any) => ({
    id: String(e.id || ''), label: e.label ? biSelf(e.label) : {is: e.menuItem?.name || '', en: e.menuItem?.name || ''},
    unitPrice: priceNumber(e.menuItem?.price), kjorPrice: e.kjorPrice ?? priceNumber(e.menuItem?.price),
    bulkAt: e.bulkAt ?? Infinity, step: e.step, max: e.max, image: mkProductPic(e.image) || '',
  })).filter((e: OrderExtra) => e.id && Number.isSafeInteger(e.unitPrice) && e.unitPrice > 0 && Number.isSafeInteger(e.kjorPrice) && e.kjorPrice > 0 && e.kjorPrice <= e.unitPrice && Number.isSafeInteger(e.step) && e.step > 0 && Number.isSafeInteger(e.max) && e.max >= e.step && (e.bulkAt === Infinity || (Number.isSafeInteger(e.bulkAt) && e.bulkAt > 0)))
    : FALLBACK.ORDER_EXTRAS.map(e => {
      const name = ({kleinur: 'Kleina', lengjur: 'Vínarbrauðslengja með súkkulaðiglassúr', pistasiusnudar: 'Pistasíusnúður'} as Record<string, string>)[e.id]
      const entry = menuItems.find(m => m.name === name)
      const price = entry ? priceNumber(entry.price) : e.unitPrice
      return {...e, unitPrice: price, kjorPrice: price}
    }).filter(e => Number.isSafeInteger(e.unitPrice) && e.unitPrice > 0)
  const offer = s?.partyOffer
  const offerValid = offer?.enabled === true && Number.isSafeInteger(offer.threshold) && offer.threshold > 0 && Number.isSafeInteger(offer.discountPct) && offer.discountPct > 0 && offer.discountPct <= 100

  return {
    textOverrides: Object.fromEntries((Array.isArray(s?.textOverrides) ? s.textOverrides : []).filter((entry: any) => typeof entry?.key === 'string' && entry?.text).map((entry: any) => [entry.key, biSelf(entry.text)])),
    ORDER_EXTRAS: extras,
    VEISLUKJOR: offerValid ? {threshold: offer.threshold, discountPct: offer.discountPct, nudgeFrom: offer.threshold / 2} : FALLBACK.VEISLUKJOR,
    LINKS: linksMerged,
    HOURS_BY_DAY: hoursByDay,
    hoursRows: { en: buildHoursRows(hoursByDay, 'en'), is: buildHoursRows(hoursByDay, 'is') },
    images: Object.fromEntries((Array.isArray(s?.images) ? s.images : []).filter((i: any) => i?.slot && i?.image?.asset?._ref).map((i: any) => [i.slot, {src: builder.image(i.image).width(1800).quality(84).auto('format').url(), caption: biSelf(i.caption)}])),
    ordersPaused: s?.ordersPaused === true,
    ordersPauseMessage: s?.ordersPauseMessage ? biPick(s.ordersPauseMessage, FALLBACK.ordersPauseMessage) : FALLBACK.ordersPauseMessage,
    dateExceptions: Array.isArray(raw?.hours?.exceptions) ? raw.hours.exceptions.map((d: any) => ({date: String(d.date || ''), open: hm(d.open, -1), close: hm(d.close, -1), closed: d.closed === true})) : [],
    mainName: pick(s?.mainAddress, FALLBACK.mainName),
    trustLine: s?.trustLine ? biSelf(s.trustLine) : FALLBACK.trustLine,
    heroTitle: raw?.hero?.heroTitle ? biPick(raw.hero.heroTitle, FALLBACK.heroTitle) : FALLBACK.heroTitle,
    heroSub: raw?.hero?.heroSub ? biPick(raw.hero.heroSub, FALLBACK.heroSub) : FALLBACK.heroSub,
    heroLine: raw?.hero?.heroLine ? biPick(raw.hero.heroLine, FALLBACK.heroLine) : FALLBACK.heroLine,
    heroPhotoCaption: raw?.hero?.heroPhotoCaption ? biPick(raw.hero.heroPhotoCaption, FALLBACK.heroPhotoCaption) : FALLBACK.heroPhotoCaption,
    statementQuote: raw?.story?.statementQuote ? biPick(raw.story.statementQuote, FALLBACK.statementQuote) : FALLBACK.statementQuote,
    statementWho: raw?.story?.statementWho ? biPick(raw.story.statementWho, FALLBACK.statementWho) : FALLBACK.statementWho,
    storyP1: raw?.story?.storyP1 ? biPick(raw.story.storyP1, FALLBACK.storyP1) : FALLBACK.storyP1,
    storyP2: raw?.story?.storyP2 ? biPick(raw.story.storyP2, FALLBACK.storyP2) : FALLBACK.storyP2,
    FEATURE: featuredList[0] || FEATURE,
    MENU: Array.isArray(raw?.menuItems) ? menu : MENU,
    BREAD: Array.isArray(raw?.menuItems) ? bread : BREAD,
    CAKES: Array.isArray(raw?.menuItems) ? cakes : CAKES,
    REVIEWS: reviews,
    GALLERY: gallery,
    ORDER_PRODUCTS: Array.isArray(raw?.orderProducts) ? orderProducts : ORDER_PRODUCTS,
    OCCASIONS: occasions,
    PICKUP_LOCATIONS: pickupLocations,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── React glue ─────────────────────────────────────────────────────────── */


const Ctx = createContext<SiteContent>(FALLBACK)

/* ── content baked in at build time ──────────────────────────────────────
 * The pages are prerendered, and effects do not run during a server render,
 * so without this the prerendered HTML always carried the BUNDLED content —
 * meaning an owner could edit a price in the CMS, see it change in his
 * browser, and Google and the AI crawlers would keep reading the old copy
 * until somebody rebuilt the site. Silent, and exactly the kind of surprise
 * a handover must not contain.
 *
 * So the prerender fetches the CMS, renders from it, and writes the same
 * payload into the HTML. The browser's FIRST render parses that payload, so
 * the server markup and the client markup are identical and hydration stays
 * clean; the effect below then refetches for anything published since the
 * build.
 *
 * A page without the payload (the catalogue preview) simply starts from the
 * bundled content exactly as before. */
let ssrRaw: unknown = null
/** Called by the prerender before rendering. No effect in a browser. */
export function setPrerenderRaw(raw: unknown) {
  ssrRaw = raw
  bakedCache = undefined
}

let bakedCache: SiteContent | undefined
function bakedContent(): SiteContent {
  if (bakedCache) return bakedCache
  let raw: unknown = ssrRaw
  if (typeof document !== 'undefined') {
    const el = document.getElementById('__reynir_cms')
    if (el?.textContent) {
      try {
        raw = JSON.parse(el.textContent)
      } catch {
        /* a corrupt payload must not white-screen the page */
      }
    }
  }
  bakedCache = raw ? merge(raw) : FALLBACK
  return bakedCache
}

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(bakedContent)
  const [previewError, setPreviewError] = useState('')
  useEffect(() => {
    let live = true
    let loading = false
    const load = async () => {
      if (loading) return
      loading = true
      try {
        let raw: unknown
        if (isPreview) {
          const response = await fetch('/api/preview/content', {credentials: 'same-origin', cache: 'no-store', signal: AbortSignal.timeout(12_000)})
          if (!response.ok) throw new Error('Open this page through Sanity Presentation to start a preview session.')
          raw = await response.json()
        } else raw = await client.fetch(QUERY)
        if (live && raw) { setContent(merge(raw)); setPreviewError('') }
      } catch (e) {
        if (live && isPreview) setPreviewError(e instanceof Error ? e.message : 'Preview unavailable')
      } finally { loading = false }
    }
    void load()
    if (!isPreview) return () => { live = false }
    // Fixed-query server polling preserves live authoring without exposing a
    // token or opening an unauthenticated Sanity event stream in the browser.
    const timer = window.setInterval(() => { void load() }, 1500)

    let cleanupVE: (() => void) | undefined
    import('@sanity/visual-editing')
      .then(({ enableVisualEditing }) => { if (live) cleanupVE = enableVisualEditing() })
      .catch(() => {})

    return () => {
      live = false
      window.clearInterval(timer)
      cleanupVE?.()
    }
  }, [])
  return createElement(Ctx.Provider, { value: content }, previewError ? createElement('div', {role: 'alert', style: {position: 'fixed', inset: '0 0 auto', zIndex: 1000, background: '#fff', color: '#222', padding: 16}}, previewError) : null, children)
}

export const useSiteContent = () => useContext(Ctx)

/** Layout stays fixed; owners replace the photographs and their descriptions. */
export function useSiteArt() {
  const {images, CAKES, MENU} = useSiteContent()
  const frame = <T extends {src: string}>(base: T, slot: string): T => images[slot] ? {...base, src: images[slot].src} : base
  const menu = Object.fromEntries(Object.entries(MENU_ART).map(([slot, art]) => [slot, {...frame(art, slot), cap: images[slot]?.caption ?? art.cap}])) as typeof MENU_ART
  // A shared caption must not claim a price that any pictured item no longer has.
  const lengjur = MENU.filter(item => item.name.toLowerCase().includes('lengja'))
  menu.lengjur.price = lengjur.length && new Set(lengjur.map(item => item.price)).size === 1 ? lengjur[0].price : undefined
  return {
    FEATURE_IMG: images.hero?.src ?? FEATURE_IMG,
    PRODUCT_IMG: images.featured?.src ?? PRODUCT_IMG,
    SHOP_IMG: images.shop?.src ?? SHOP_IMG,
    MENU_ART: menu,
    CAKE_ART: {...CAKE_ART, price: CAKES.find(c => c.name === 'Eplakaka')?.price, frames: CAKE_ART.frames.map((f, i) => ({...frame(f, `cake${i}`), alt: images[`cake${i}`]?.caption ?? f.alt}))},
    STORY_ART: {open: frame(STORY_ART.open, 'storyOpen'), founding: frame(STORY_ART.founding, 'storyFounding'), today: frame(STORY_ART.today, 'storyToday')},
  }
}

export function usePageText(lang: Lang) {
  const {textOverrides, mainName, trustLine} = useSiteContent()
  const overrides = Object.fromEntries(Object.entries(textOverrides).filter(([key]) => key.startsWith('page:') && typeof (T[lang] as Record<string, unknown>)[key.slice(5)] === 'string').map(([key, value]) => [key.slice(5), value[lang]]))
  return {...T[lang], ...overrides, mainName, trustLine: trustLine[lang]}
}
export function useOrderText(lang: Lang) {
  const {textOverrides} = useSiteContent()
  const overrides = Object.fromEntries(Object.entries(textOverrides).filter(([key]) => key.startsWith('order:') && typeof (ORDER_T[lang] as unknown as Record<string, unknown>)[key.slice(6)] === 'string').map(([key, value]) => [key.slice(6), value[lang]]))
  return {...ORDER_T[lang], ...overrides}
}
