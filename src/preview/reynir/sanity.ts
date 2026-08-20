/**
 * Live content for the Reynir bakarí page + order configurator, read from the
 * Sanity CMS (project v4v3s4wg / dataset production — the studio at
 * reynir-cms/).
 *
 * Same fallback-safe pattern as polarhestar/sanity.ts: the page renders
 * instantly from the bundled data.ts/order.ts values, then this layer fetches
 * the CMS content and swaps it in per field. A blank/missing CMS field falls
 * back to the bundled value — the page can never render empty, even if
 * Sanity is unreachable or the dataset temporarily has nothing in it (e.g.
 * the order catalogue, hero, story, hours, settings, menu and reviews are all
 * seeded; gallery photo ASSETS are not yet uploaded, so gallery always falls
 * back to the bundled photos until that's done).
 *
 * Only the fields reynir-cms-plan.md actually names as owner-editable are
 * wired here (order catalogue, menu/bread/cakes, hours, contact, story,
 * gallery, reviews, hero) — nav labels and other UI chrome stay hardcoded in
 * data.ts's T object on purpose, matching the CMS's "content only" scope.
 *
 * Preview mode (inside the studio's Presentation iframe, or ?preview):
 *  - reads DRAFTS with a read-only viewer token → unpublished edits visible
 *  - live listener re-fetches on every edit → the panel updates as you type
 *  - stega + visual editing → text carries a link back to its exact field
 */
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {
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
  OCCASIONS,
  ORDER_PRODUCTS,
  PICKUP_LOCATIONS,
  type Bilingual,
  type OrderChoice,
  type OrderGroup,
  type OrderProduct,
} from './order'

/* ── Preview detection ──────────────────────────────────────────────────── */
const viewerToken = import.meta.env.VITE_REYNIR_SANITY_VIEWER_TOKEN as string | undefined

/* Every branch below is guarded on `window`, because this module is imported by
 * the SSR prerender (reynir-entry-server.tsx) where there is no window at all.
 *
 * The token requirement is not decoration. Without it, appending ?preview to a
 * public URL would flip the client to the 'drafts' perspective and pull in the
 * visual-editing runtime on the CLIENT's own domain — a stranger's URL bar
 * deciding which content a customer sees. Preview mode is for the studio, so
 * it now requires the credential only the studio build carries. */
const isPreview =
  typeof window !== 'undefined' &&
  !!viewerToken &&
  (new URLSearchParams(window.location.search).has('preview') || window.self !== window.top)

/* Where the click-to-edit overlays point back to. This defaulted to
 * localhost:3333, which is correct while developing and wrong in every
 * shipped build — the deployed bundle carried a studio address that exists
 * only on our own machine, so an owner clicking an element in the preview
 * would be sent nowhere. The deployed studio is the right default; the env
 * var still overrides it for local studio work. */
const STUDIO_URL =
  (import.meta.env.VITE_REYNIR_SANITY_STUDIO_URL as string | undefined) ||
  'https://reynir-bakari.sanity.studio'

const STEGA_SKIP = new Set(['id', 'order', 'active', 'phoneHref', 'email', 'orderEmail', 'ahaUrl', 'woltUrl', 'facebook', 'instagram', '_id', '_type'])

const client = createClient({
  projectId: 'v4v3s4wg',
  dataset: 'production',
  apiVersion: '2025-08-15',
  useCdn: false,
  perspective: isPreview ? 'drafts' : 'published',
  token: isPreview ? viewerToken : undefined,
  ignoreBrowserTokenWarning: true,
  stega: isPreview
    ? {
        enabled: true,
        studioUrl: STUDIO_URL,
        filter: (props) => {
          const path = props.sourcePath
          const last = path[path.length - 1]
          if (typeof last === 'string' && STEGA_SKIP.has(last)) return false
          return props.filterDefault(props)
        },
      }
    : undefined,
})

const builder = imageUrlBuilder({ projectId: 'v4v3s4wg', dataset: 'production' })

type RawImg = { asset?: { _ref?: string }; hotspot?: { x?: number; y?: number } } | null | undefined
/** A CMS gallery upload, rendered at both sizes the tile/lightbox pair needs.
 *  Falls back to the bundled frame whole — never half-CMS, half-bundle. */
function mkGalleryPic(img: RawImg, fallback: GalleryPhoto): { src: string; srcSm: string; w: number; h: number } {
  if (!img?.asset?._ref) return { src: fallback.src, srcSm: fallback.srcSm, w: fallback.w, h: fallback.h }
  const at = (w: number) => builder.image(img).width(w).quality(80).auto('format').url()
  return { src: at(2000), srcSm: at(800), w: fallback.w, h: fallback.h }
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
  return m ? Number(m[1]) * 60 + Number(m[2]) : fb
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
  OCCASIONS: { id: string; label: Bilingual }[]
  PICKUP_LOCATIONS: { id: string; label: Bilingual }[]
}

const FALLBACK: SiteContent = {
  LINKS,
  HOURS_BY_DAY,
  // Generated from HOURS_BY_DAY, never typed out separately — so the printed
  // hours and the live open/closed badge cannot drift apart.
  hoursRows: { en: buildHoursRows(HOURS_BY_DAY, 'en'), is: buildHoursRows(HOURS_BY_DAY, 'is') },
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
export const QUERY = `{
  "settings": *[_type=="siteSettings"][0]{phoneDisplay, phoneHref, email, orderEmail, facebook, instagram, ahaUrl, woltUrl, mainAddress, trustLine},
  "hours": *[_type=="openingHours"][0]{mon, tue, wed, thu, fri, sat, sun},
  "hero": *[_type=="heroSection"][0]{heroTitle, heroSub, heroLine, heroPhotoCaption},
  "story": *[_type=="storySection"][0]{statementQuote, statementWho, storyP1, storyP2},
  "menuItems": *[_type=="menuItem"]|order(order asc){category, name, price, tag, desc},
  "reviews": *[_type=="review"]|order(order asc){quote, who},
  "gallery": *[_type=="galleryImage"]|order(order asc){image{asset,hotspot}, caption},
  "orderProducts": *[_type=="orderProduct" && active != false]|order(order asc){
    "id": id.current, name, blurb, basePrice, pricePerPerson, "sizeGroupId": sizeGroupId.current,
    leadDays, inscription, image{asset,hotspot},
    groups[]{"id": id.current, kind, label, help, required, max,
      choices[]{"id": id.current, label, priceDelta, note, serves, quoteOnly, needsPhoto, freeText}}
  },
  "occasions": *[_type=="occasion"]|order(order asc){"id": id.current, label},
  "pickupLocations": *[_type=="pickupLocation"]|order(order asc){"id": id.current, label}
}`

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
        typeof d.pricePerPerson === 'number' && d.pricePerPerson > 0 ? d.pricePerPerson : undefined,
      sizeGroupId: d.sizeGroupId ? String(d.sizeGroupId) : undefined,
      // CMS photo when uploaded, otherwise the bundled crop for a product we
      // already ship one for. A brand-new product with neither still renders.
      image: mkProductPic(d.image) ?? ORDER_PRODUCTS.find((p) => p.id === String(d.id || ''))?.image,
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
            required: g.required !== false,
            max: typeof g.max === 'number' ? g.max : undefined,
            choices: Array.isArray(g.choices)
              ? g.choices.map((c: any): OrderChoice => ({
                  id: String(c.id || ''),
                  label: biSelf(c.label),
                  priceDelta: typeof c.priceDelta === 'number' ? c.priceDelta : 0,
                  note: c.note ? biSelf(c.note) : undefined,
                  serves: typeof c.serves === 'number' && c.serves > 0 ? c.serves : undefined,
                  quoteOnly: c.quoteOnly === true,
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
    .filter((p) => p.id && (p.name.en || p.name.is) && p.groups.length > 0)
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
        return {
          open: hm(d?.open, fb.open),
          close: hm(d?.close, fb.close),
          closed: !!d?.closed,
        }
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

  const reviews: Review[] = Array.isArray(raw?.reviews) && raw.reviews.length
    ? raw.reviews
        .map((d: any): Review => ({ quote: biSelf(d.quote), who: String(d.who || '') }))
        .filter((r: Review) => r.who && (r.quote.en || r.quote.is))
    : REVIEWS

  const gallery: GalleryPhoto[] = Array.isArray(raw?.gallery) && raw.gallery.length
    ? raw.gallery.map((g: any, i: number) => {
        const fb = GALLERY[i % GALLERY.length]
        const pic = mkGalleryPic(g?.image, fb)
        return { src: pic.src, srcSm: pic.srcSm, w: pic.w, h: pic.h, caption: g?.caption ? biSelf(g.caption) : fb.caption }
      })
    : GALLERY

  const orderProducts = mergeOrderProducts(Array.isArray(raw?.orderProducts) ? raw.orderProducts : [])
  const occasions = Array.isArray(raw?.occasions) && raw.occasions.length
    ? raw.occasions.map((o: any) => ({ id: String(o.id || ''), label: biSelf(o.label) })).filter((o: any) => o.id && (o.label.en || o.label.is))
    : OCCASIONS
  const pickupLocations = Array.isArray(raw?.pickupLocations) && raw.pickupLocations.length
    ? raw.pickupLocations.map((l: any) => ({ id: String(l.id || ''), label: biSelf(l.label) })).filter((l: any) => l.id && (l.label.en || l.label.is))
    : PICKUP_LOCATIONS

  return {
    LINKS: linksMerged,
    HOURS_BY_DAY: hoursByDay,
    hoursRows: { en: buildHoursRows(hoursByDay, 'en'), is: buildHoursRows(hoursByDay, 'is') },
    mainName: FALLBACK.mainName,
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
    MENU: menu.length ? menu : MENU,
    BREAD: bread.length ? bread : BREAD,
    CAKES: cakes.length ? cakes : CAKES,
    REVIEWS: reviews,
    GALLERY: gallery,
    ORDER_PRODUCTS: orderProducts.length ? orderProducts : ORDER_PRODUCTS,
    OCCASIONS: occasions,
    PICKUP_LOCATIONS: pickupLocations,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── React glue ─────────────────────────────────────────────────────────── */
const LISTEN = `*[_type in ["siteSettings","openingHours","heroSection","storySection","menuItem","review","galleryImage","orderProduct","occasion","pickupLocation"]]`

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
  useEffect(() => {
    let live = true
    const load = () =>
      client
        .fetch(QUERY)
        .then((raw) => { if (live && raw) setContent(merge(raw)) })
        .catch((e) => console.warn('[reynir] CMS fetch failed, using bundled content:', e?.message))
    load()

    if (!isPreview) return () => { live = false }

    if (!viewerToken) {
      console.warn('[reynir] preview mode but VITE_REYNIR_SANITY_VIEWER_TOKEN is missing — drafts will not load.')
    }
    const sub = client
      .listen(LISTEN, {}, { visibility: 'query', includeResult: false })
      .subscribe({ next: () => load(), error: (e) => console.warn('[reynir] live listen error:', e?.message) })

    let cleanupVE: (() => void) | undefined
    import('@sanity/visual-editing')
      .then(({ enableVisualEditing }) => { if (live) cleanupVE = enableVisualEditing() })
      .catch(() => {})

    return () => {
      live = false
      sub.unsubscribe()
      cleanupVE?.()
    }
  }, [])
  return createElement(Ctx.Provider, { value: content }, children)
}

export const useSiteContent = () => useContext(Ctx)
