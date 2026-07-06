/**
 * Live content for the Pólar Hestar page, read from the Sanity CMS
 * (project qkoya49k / dataset production — the studio at polarhestar-cms/).
 *
 * The page renders instantly from the bundled data.ts values, then this layer
 * fetches the CMS content and swaps it in. Everything merges OVER data.ts per
 * field, so a blank CMS field falls back to the original — the page can never
 * render empty, even if Sanity is unreachable.
 *
 * Preview mode (inside the studio's Presentation iframe, or ?preview):
 *  - reads DRAFTS with a read-only viewer token → unpublished edits visible
 *  - live listener re-fetches on every edit → the panel updates as you type
 *  - stega + visual editing → every text carries an invisible link back to
 *    its exact field, so the studio's edit-overlays can highlight and open it
 */
import { createContext, createElement, useContext, useEffect, useState, type ReactNode } from 'react'
import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import {
  ADDRESS,
  BOOKING_EMAIL,
  COPY,
  EMAIL,
  FACEBOOK,
  FARM,
  GOOD_TO_KNOW,
  IMG,
  type GoodToKnowData,
  type L3,
  type LongTour,
  LONG_TOURS,
  MAPS_HREF,
  PHONE_DISPLAY,
  PHONE_HREF,
  REVIEWS,
  type Season,
  SEASONS,
  SHOP,
  SHORT_TOURS,
  STATS,
  type Tour,
} from './data'

/* ── Preview detection ──────────────────────────────────────────────────── */
const isPreview =
  typeof window !== 'undefined' &&
  (window.self !== window.top || new URLSearchParams(window.location.search).has('preview'))

const viewerToken = import.meta.env.VITE_SANITY_VIEWER_TOKEN as string | undefined
const STUDIO_URL = 'http://localhost:3333'

/** Field names whose values feed logic/attributes — keep stega out of them. */
const STEGA_SKIP = new Set([
  'key', 'glow', 'phoneHref', 'email', 'bookingEmail', 'mapsUrl', 'facebook', 'order', '_id', '_type',
])

const client = createClient({
  projectId: 'qkoya49k',
  dataset: 'production',
  apiVersion: '2025-08-15',
  useCdn: false, // fresh reads — a sandbox must reflect edits immediately
  perspective: isPreview ? 'drafts' : 'published',
  token: isPreview ? viewerToken : undefined,
  ignoreBrowserTokenWarning: true, // read-only viewer token, sandbox only
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

const builder = imageUrlBuilder({ projectId: 'qkoya49k', dataset: 'production' })

/* ── Picture plumbing — CMS image (hotspot-aware) or Unsplash fallback ──── */
export interface Pic {
  src: string
  srcSet: string
  /** CSS object-position honoring the editor's hotspot at any crop ratio */
  pos?: string
  /** CMS alt text (one string, used for every language when present) */
  alt?: string
}

const uu = (id: string, w = 1600) => `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`
const fallbackPic = (id: string): Pic => ({
  src: uu(id, 1600),
  srcSet: `${uu(id, 828)} 828w, ${uu(id, 1280)} 1280w, ${uu(id, 2000)} 2000w`,
})

type RawImg = { asset?: { _ref?: string }; hotspot?: { x?: number; y?: number }; alt?: string } | null | undefined

function mkPic(img: RawImg, fallbackId: string): Pic {
  if (!img?.asset?._ref) return fallbackPic(fallbackId)
  const at = (w: number) => builder.image(img).width(w).quality(78).auto('format').url()
  return {
    src: at(1600),
    srcSet: `${at(828)} 828w, ${at(1280)} 1280w, ${at(2000)} 2000w`,
    pos: img.hotspot ? `${Math.round((img.hotspot.x ?? 0.5) * 100)}% ${Math.round((img.hotspot.y ?? 0.5) * 100)}%` : undefined,
    alt: img.alt || undefined,
  }
}

/* ── Merged content shapes (data.ts shapes + resolved pictures) ─────────── */
export type TourX = Tour & { pic: Pic }
export type LongTourX = LongTour & { pic: Pic }
export type SeasonX = Season & { pic: Pic }

export interface SiteContent {
  COPY: typeof COPY
  SHORT_TOURS: TourX[]
  LONG_TOURS: LongTourX[]
  SEASONS: SeasonX[]
  REVIEWS: typeof REVIEWS
  SHOP: typeof SHOP
  STATS: typeof STATS
  GTK: GoodToKnowData
  FARM: GoodToKnowData
  GALLERY: Pic[]
  PICS: { hero: Pic; story: Pic; booking: Pic; family: Pic; location: Pic; ctaBand: Pic }
  ADDRESS: string
  EMAIL: string
  BOOKING_EMAIL: string
  FACEBOOK: string
  MAPS_HREF: string
  CHILD_DISCOUNT: number
  PHONE_DISPLAY: string
  PHONE_HREF: string
}

const FALLBACK: SiteContent = {
  COPY,
  SHORT_TOURS: SHORT_TOURS.map((t) => ({ ...t, pic: fallbackPic(t.image) })),
  LONG_TOURS: LONG_TOURS.map((t) => ({ ...t, pic: fallbackPic(t.image) })),
  SEASONS: SEASONS.map((s) => ({ ...s, pic: fallbackPic(s.image) })),
  REVIEWS,
  SHOP,
  STATS,
  GTK: GOOD_TO_KNOW,
  FARM,
  GALLERY: IMG.procession.map((id) => ({
    src: uu(id, 400),
    srcSet: `${uu(id, 400)} 400w, ${uu(id, 700)} 700w`,
  })),
  PICS: {
    hero: fallbackPic(IMG.hero),
    story: fallbackPic(IMG.story),
    booking: fallbackPic(IMG.booking),
    family: fallbackPic(IMG.family),
    location: fallbackPic(IMG.location),
    ctaBand: fallbackPic(IMG.ctaBand),
  },
  ADDRESS,
  EMAIL,
  BOOKING_EMAIL,
  FACEBOOK,
  MAPS_HREF,
  CHILD_DISCOUNT: 2000,
  PHONE_DISPLAY,
  PHONE_HREF,
}

/* ── GROQ: everything editable, in one round trip ───────────────────────── */
const IMG_PRJ = '{asset, hotspot, "alt": alt}'
const QUERY = `{
  "hero": *[_type=="heroSection"][0]{eyebrow, headlineLine1, headlineLine2, lede, image ${IMG_PRJ}},
  "story": *[_type=="storySection"][0]{eyebrow, heading, paragraph1, paragraph2, quote, image ${IMG_PRJ}},
  "sections": *[_type=="sectionsCopy"][0]{
    ..., bookingImage ${IMG_PRJ}, trustFamilyImage ${IMG_PRJ}, visitImage ${IMG_PRJ}, ctaImage ${IMG_PRJ}
  },
  "settings": *[_type=="siteSettings"][0]{phoneDisplay, phoneHref, email, bookingEmail, facebook, address, mapsUrl, childDiscount, stats},
  "tours": *[_type=="tour"]|order(order asc){_id, name, duration, level, price, months, blurb, image ${IMG_PRJ}},
  "seasons": *[_type=="season"]|order(order asc){_id, key, name, kicker, line, tourLabel, glow, image ${IMG_PRJ}},
  "longTours": *[_type=="longTour"]|order(order asc){_id, name, meta, blurb, image ${IMG_PRJ}},
  "reviews": *[_type=="review"]|order(name asc){_id, quote, name, origin},
  "shop": *[_type=="shopItem"]|order(order asc){_id, name, price, from},
  "gtk": *[_type=="goodToKnow"][0]{eyebrow, heading, body, items[]{title, body}},
  "farm": *[_type=="farmSection"][0]{eyebrow, heading, body, items[]{title, body}},
  "gallery": *[_type=="galleryImage"]|order(order asc){image ${IMG_PRJ}}
}`

type RawL3 = { is?: string; en?: string; de?: string } | null | undefined
/** Trilingual field: CMS value per language, falling back per language. */
const l3 = (v: RawL3, fb: L3): L3 => ({ is: v?.is ?? fb.is, en: v?.en ?? fb.en, de: v?.de ?? fb.de })

/** sectionsCopy field → COPY key (hero/story handled via their own docs). */
const SECTION_MAP: Array<[string, keyof typeof COPY['is']]> = [
  ['herdEyebrow', 'procEyebrow'], ['herdHeading', 'procH2'], ['herdBody', 'procBody'],
  ['toursEyebrow', 'toursEyebrow'], ['toursHeading', 'toursH2'], ['toursBody', 'toursBody'],
  ['toursChildNote', 'childNote'], ['toursWeightNote', 'weightNote'],
  ['bookingEyebrow', 'bookEyebrow'], ['bookingHeading', 'bookH2'], ['bookingBody', 'bookBody'],
  ['bookingPanelLine', 'bookPanelLine'],
  ['seasonsEyebrow', 'seasonsEyebrow'], ['seasonsHeading', 'seasonsH2'], ['seasonsBody', 'seasonsBody'],
  ['longEyebrow', 'longEyebrow'], ['longHeading', 'longH2'], ['longBody', 'longBody'],
  ['trustEyebrow', 'trustEyebrow'], ['trustHeading', 'trustH2'], ['trustBody', 'trustBody'],
  ['trustFamilyTitle', 'familyTitle'], ['trustFamilyBody', 'familyBody'],
  ['shopEyebrow', 'shopEyebrow'], ['shopHeading', 'shopH2'], ['shopBody', 'shopBody'],
  ['visitEyebrow', 'visitEyebrow'], ['visitHeading', 'visitH2'],
  ['visitGettingThere', 'gettingThere'], ['visitSeasonInfo', 'seasonInfo'],
  ['ctaHeading', 'ctaH2'], ['ctaBody', 'ctaBody'],
]

/* eslint-disable @typescript-eslint/no-explicit-any */
function merge(raw: any): SiteContent {
  const strip = (id: string) => String(id).replace(/^(tour|season|longtour|shopitem|review)-/, '')

  const tours: TourX[] = Array.isArray(raw?.tours) && raw.tours.length
    ? raw.tours.map((d: any, i: number): TourX => {
        const fb = SHORT_TOURS.find((t) => t.id === strip(d._id)) ?? SHORT_TOURS[i] ?? SHORT_TOURS[0]
        return {
          id: fb.id,
          name: l3(d.name, fb.name),
          meta: l3(d.duration, fb.meta),
          level: l3(d.level, fb.level),
          price: typeof d.price === 'number' ? d.price : fb.price,
          image: fb.image,
          blurb: l3(d.blurb, fb.blurb),
          months: Array.isArray(d.months) && d.months.length ? d.months : fb.months,
          pic: mkPic(d.image, fb.image),
        }
      })
    : FALLBACK.SHORT_TOURS

  const longTours: LongTourX[] = Array.isArray(raw?.longTours) && raw.longTours.length
    ? raw.longTours.map((d: any, i: number): LongTourX => {
        const fb = LONG_TOURS.find((t) => t.id === strip(d._id)) ?? LONG_TOURS[i] ?? LONG_TOURS[0]
        return {
          id: fb.id,
          name: l3(d.name, fb.name),
          meta: l3(d.meta, fb.meta),
          image: fb.image,
          blurb: l3(d.blurb, fb.blurb),
          pic: mkPic(d.image, fb.image),
        }
      })
    : FALLBACK.LONG_TOURS

  const seasons: SeasonX[] = Array.isArray(raw?.seasons) && raw.seasons.length
    ? raw.seasons.map((d: any, i: number): SeasonX => {
        const fb = SEASONS.find((s) => s.id === d.key) ?? SEASONS[i] ?? SEASONS[0]
        return {
          id: fb.id,
          name: l3(d.name, fb.name),
          kicker: l3(d.kicker, fb.kicker),
          line: l3(d.line, fb.line),
          tour: l3(d.tourLabel, fb.tour),
          image: fb.image,
          glow: d.glow || fb.glow,
          pic: mkPic(d.image, fb.image),
        }
      })
    : FALLBACK.SEASONS

  const reviews = Array.isArray(raw?.reviews) && raw.reviews.length
    ? raw.reviews.map((d: any, i: number) => {
        const fb = REVIEWS[i] ?? REVIEWS[0]
        return { quote: l3(d.quote, fb.quote), name: d.name || fb.name, origin: l3(d.origin, fb.origin) }
      })
    : REVIEWS

  const shop = Array.isArray(raw?.shop) && raw.shop.length
    ? raw.shop.map((d: any, i: number) => {
        const fb = SHOP[i] ?? SHOP[0]
        return {
          name: l3(d.name, fb.name),
          price: typeof d.price === 'number' ? d.price : fb.price,
          from: typeof d.from === 'boolean' ? d.from : fb.from,
        }
      })
    : SHOP

  const gtk: GoodToKnowData = raw?.gtk
    ? {
        eyebrow: l3(raw.gtk.eyebrow, GOOD_TO_KNOW.eyebrow),
        heading: l3(raw.gtk.heading, GOOD_TO_KNOW.heading),
        body: l3(raw.gtk.body, GOOD_TO_KNOW.body),
        items:
          Array.isArray(raw.gtk.items) && raw.gtk.items.length
            ? raw.gtk.items.map((it: any, i: number) => {
                const fb = GOOD_TO_KNOW.items[i] ?? GOOD_TO_KNOW.items[0]
                return { title: l3(it?.title, fb.title), body: l3(it?.body, fb.body) }
              })
            : GOOD_TO_KNOW.items,
      }
    : GOOD_TO_KNOW

  const farm: GoodToKnowData = raw?.farm
    ? {
        eyebrow: l3(raw.farm.eyebrow, FARM.eyebrow),
        heading: l3(raw.farm.heading, FARM.heading),
        body: l3(raw.farm.body, FARM.body),
        items:
          Array.isArray(raw.farm.items) && raw.farm.items.length
            ? raw.farm.items.map((it: any, i: number) => {
                const fb = FARM.items[i] ?? FARM.items[0]
                return { title: l3(it?.title, fb.title), body: l3(it?.body, fb.body) }
              })
            : FARM.items,
      }
    : FARM

  const gallery: Pic[] =
    Array.isArray(raw?.gallery) && raw.gallery.length
      ? raw.gallery.map((g: any, i: number) => mkPic(g?.image, IMG.procession[i % IMG.procession.length]))
      : FALLBACK.GALLERY

  const stats = raw?.settings?.stats
    ? {
        founded: raw.settings.stats.founded ?? STATS.founded,
        years: raw.settings.stats.years ?? STATS.years,
        horses: raw.settings.stats.horses ?? STATS.horses,
        rating: raw.settings.stats.rating ?? STATS.rating,
        reviews: raw.settings.stats.reviews ?? STATS.reviews,
      }
    : STATS

  // COPY overrides: hero + story from their docs, section copy from sectionsCopy
  const h = raw?.hero
  const s = raw?.story
  const sc = raw?.sections
  const over = (base: typeof COPY['is'], lang: 'is' | 'en' | 'de') => {
    const out: Record<string, unknown> = {
      ...base,
      heroEyebrow: h?.eyebrow?.[lang] ?? base.heroEyebrow,
      heroH1a: h?.headlineLine1?.[lang] ?? base.heroH1a,
      heroH1b: h?.headlineLine2?.[lang] ?? base.heroH1b,
      heroLede: h?.lede?.[lang] ?? base.heroLede,
      storyEyebrow: s?.eyebrow?.[lang] ?? base.storyEyebrow,
      storyH2: s?.heading?.[lang] ?? base.storyH2,
      storyP1: s?.paragraph1?.[lang] ?? base.storyP1,
      storyP2: s?.paragraph2?.[lang] ?? base.storyP2,
      storyQuote: s?.quote?.[lang] ?? base.storyQuote,
    }
    if (sc) {
      for (const [field, key] of SECTION_MAP) {
        const v = sc[field]?.[lang]
        if (v) out[key] = v
      }
    }
    return out as typeof COPY['is']
  }

  return {
    COPY: { is: over(COPY.is, 'is'), en: over(COPY.en, 'en'), de: over(COPY.de, 'de') },
    SHORT_TOURS: tours,
    LONG_TOURS: longTours,
    SEASONS: seasons,
    REVIEWS: reviews,
    SHOP: shop,
    STATS: stats,
    GTK: gtk,
    FARM: farm,
    GALLERY: gallery,
    PICS: {
      hero: mkPic(h?.image, IMG.hero),
      story: mkPic(s?.image, IMG.story),
      booking: mkPic(sc?.bookingImage, IMG.booking),
      family: mkPic(sc?.trustFamilyImage, IMG.family),
      location: mkPic(sc?.visitImage, IMG.location),
      ctaBand: mkPic(sc?.ctaImage, IMG.ctaBand),
    },
    ADDRESS: raw?.settings?.address || ADDRESS,
    EMAIL: raw?.settings?.email || EMAIL,
    BOOKING_EMAIL: raw?.settings?.bookingEmail || BOOKING_EMAIL,
    FACEBOOK: raw?.settings?.facebook || FACEBOOK,
    MAPS_HREF: raw?.settings?.mapsUrl || MAPS_HREF,
    CHILD_DISCOUNT: typeof raw?.settings?.childDiscount === 'number' ? raw.settings.childDiscount : 2000,
    PHONE_DISPLAY: raw?.settings?.phoneDisplay || PHONE_DISPLAY,
    PHONE_HREF: raw?.settings?.phoneHref || PHONE_HREF,
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ── React glue ─────────────────────────────────────────────────────────── */
const LISTEN = `*[_type in ["tour","season","heroSection","storySection","siteSettings","sectionsCopy","goodToKnow","farmSection","galleryImage","longTour","review","shopItem"]]`

const Ctx = createContext<SiteContent>(FALLBACK)

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(FALLBACK)
  useEffect(() => {
    let live = true
    const load = () =>
      client
        .fetch(QUERY)
        .then((raw) => { if (live && raw) setContent(merge(raw)) })
        .catch((e) => console.warn('[polarhestar] CMS fetch failed, using bundled content:', e?.message))
    load()

    if (!isPreview) return () => { live = false }

    if (!viewerToken) {
      console.warn('[polarhestar] preview mode but VITE_SANITY_VIEWER_TOKEN is missing — drafts will not load.')
    }
    // live re-fetch whenever any content document changes (including drafts)
    const sub = client
      .listen(LISTEN, {}, { visibility: 'query', includeResult: false })
      .subscribe({ next: () => load(), error: (e) => console.warn('[polarhestar] live listen error:', e?.message) })

    // connect the page to the Presentation panel (overlays + live handshake)
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
