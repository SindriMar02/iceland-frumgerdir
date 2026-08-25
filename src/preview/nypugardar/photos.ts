/**
 * Nýpugarðar — the photo library, categorised.
 *
 * Every frame here is one of the 43 photographs on her own Booking.com
 * listing, re-harvested at Booking's max3000 endpoint and resized locally by
 * tools/nypugardar-photos.mjs. That tool carries the provenance notes; the
 * short version is that four images the first harvest picked up belonged to a
 * different property (one of them was the hero) and are gone.
 *
 * WHY A ROOM CAN BE NAMED HERE AT ALL. Booking stores, per photo, the room
 * types the owner attached it to. That is Bogga's own filing, not our reading
 * of a picture, so `room` below is a fact rather than a guess. Where a photo
 * has no room — the land, the house, the dining room — it simply has none, and
 * the page must not imply one.
 *
 * EVERY PHOTOGRAPH APPEARS ON THE PAGE EXACTLY ONCE. That is a rule, not an
 * accident: an audit on 2026-08-25 found 19 of the 43 rendering twice — the
 * hero also sat in the gallery's land row, each room-list thumbnail repeated as
 * the first tile of its own gallery row, and two photos filed under two room
 * types each showed up in both. She has 43 photographs and the page has room
 * for 43, so a repeat is never filling a gap, it just reads as though she ran
 * out. The gallery is therefore "everything not already shown above" — see
 * `galleryFor` and `restFor` — and every photo has exactly one `room`.
 */

import type { GodoRoomKey } from './godo'

const BASE = import.meta.env.BASE_URL

/** One rendered width of one photo. */
export const src = (id: string, w: number) => `${BASE}nypugardar/photos/${id}-${w}.jpg`

export type PhotoCat =
  /** her view, no buildings in frame */
  | 'land'
  /** the guesthouse, its deck, its surroundings */
  | 'house'
  /** the dining room and the food */
  | 'table'
  /** a bedroom in the main house */
  | 'room'
  /** a bathroom, private unless `shared` */
  | 'bath'
  /** inside one of the two cottages */
  | 'cottageIn'
  /** a cottage from outside */
  | 'cottageOut'

export type Photo = {
  id: string
  cat: PhotoCat
  /** Godo room key(s) Booking has this photo filed under, if any. */
  room?: readonly GodoRoomKey[]
  /** Rendered widths that exist on disk, small to large. */
  widths: readonly number[]
  portrait: boolean
  /** A bathroom two room types share, so it is never called private. */
  shared?: boolean
  /** Visible photographer credit burnt into the frame. */
  credit?: string
}

const TILE = [480, 900] as const
const WIDE = [480, 1100, 2000] as const
const HERO = [640, 1280, 2000, 2600] as const

/** Mirrors the manifest in tools/nypugardar-photos.mjs. Keep the two in step:
 *  the tool writes the files, this decides where they land on the page. */
export const PHOTOS: readonly Photo[] = [
  // ── The land
  { id: '125645004', cat: 'land', widths: HERO, portrait: false },
  { id: '125645011', cat: 'land', widths: WIDE, portrait: false },
  { id: '125645015', cat: 'land', widths: WIDE, portrait: false },
  { id: '125645022', cat: 'land', widths: WIDE, portrait: false },
  { id: '125644995', cat: 'land', widths: WIDE, portrait: false },
  { id: '10523812', cat: 'land', widths: WIDE, portrait: false },
  { id: '10523758', cat: 'land', widths: TILE, portrait: false },
  { id: '10523864', cat: 'land', widths: TILE, portrait: false },

  // ── The house
  { id: '258957593', cat: 'house', widths: WIDE, portrait: false, credit: 'wiebke-schellers' },
  { id: '510526816', cat: 'house', widths: TILE, portrait: true },

  // ── The table
  { id: '305950064', cat: 'table', widths: WIDE, portrait: false },
  { id: '259128011', cat: 'table', widths: WIDE, portrait: false },

  // ── Small twin, shared bathroom
  { id: '539099044', cat: 'room', room: ['twinSharedEconomy'], widths: TILE, portrait: false },
  { id: '539099047', cat: 'room', room: ['twinSharedEconomy'], widths: TILE, portrait: false },
  { id: '539099049', cat: 'room', room: ['twinSharedEconomy'], widths: TILE, portrait: false },

  // ── Double/twin, shared bathroom
  { id: '510521394', cat: 'room', room: ['doubleTwinShared'], widths: TILE, portrait: true },
  { id: '510521438', cat: 'room', room: ['doubleTwinShared'], widths: TILE, portrait: true },
  { id: '510523433', cat: 'room', room: ['doubleTwinShared'], widths: TILE, portrait: true },
  { id: '510523430', cat: 'room', room: ['doubleTwinShared'], widths: TILE, portrait: true },
  /* The bathroom the two shared-bathroom types share. Booking files it under
   * both, and it used to render under both — which is how the same photograph
   * appeared twice in one section. It is listed under the economy twin only,
   * and its caption says "shared", which is the fact that matters. */
  { id: '510523749', cat: 'bath', room: ['twinSharedEconomy'], widths: TILE, portrait: true, shared: true },

  // ── Double/twin, private bathroom
  { id: '510523878', cat: 'room', room: ['doubleTwinPrivate'], widths: TILE, portrait: true },
  { id: '510523877', cat: 'room', room: ['doubleTwinPrivate'], widths: TILE, portrait: true },
  { id: '510523966', cat: 'room', room: ['doubleTwinPrivate'], widths: TILE, portrait: true },
  { id: '510523968', cat: 'bath', room: ['doubleTwinPrivate'], widths: TILE, portrait: true },

  // ── Double/twin with an extra bed
  { id: '510524066', cat: 'room', room: ['doublePrivateExtraBed'], widths: TILE, portrait: true },
  { id: '510524029', cat: 'room', room: ['doublePrivateExtraBed'], widths: TILE, portrait: true },
  { id: '510524067', cat: 'room', room: ['doublePrivateExtraBed'], widths: TILE, portrait: true },
  { id: '510524064', cat: 'room', room: ['doublePrivateExtraBed'], widths: TILE, portrait: true },
  { id: '510524063', cat: 'bath', room: ['doublePrivateExtraBed'], widths: TILE, portrait: true },
  { id: '510524065', cat: 'bath', room: ['doublePrivateExtraBed'], widths: TILE, portrait: true },

  // ── Double
  { id: '510523622', cat: 'room', room: ['double'], widths: TILE, portrait: true },
  { id: '510523625', cat: 'bath', room: ['double'], widths: TILE, portrait: true },

  // ── Cottage for three
  { id: '510526820', cat: 'cottageIn', room: ['cottage3'], widths: TILE, portrait: true },
  { id: '510524300', cat: 'cottageIn', room: ['cottage3'], widths: TILE, portrait: true },
  { id: '510524299', cat: 'bath', room: ['cottage3'], widths: TILE, portrait: true },
  { id: '510524306', cat: 'cottageOut', room: ['cottage3'], widths: TILE, portrait: true },
  { id: '510524307', cat: 'cottageOut', room: ['cottage3'], widths: TILE, portrait: true },

  // ── Family cottage
  { id: '510524188', cat: 'cottageIn', room: ['familyCottage'], widths: TILE, portrait: true },
  { id: '510524194', cat: 'cottageIn', room: ['familyCottage'], widths: TILE, portrait: true },
  { id: '510524196', cat: 'cottageIn', room: ['familyCottage'], widths: TILE, portrait: true },
  { id: '510524189', cat: 'bath', room: ['familyCottage'], widths: TILE, portrait: true },
  { id: '510524232', cat: 'cottageOut', room: ['familyCottage'], widths: TILE, portrait: true },
  /* Both cottages stand in this frame, so Booking files it under both. It sits
   * with the family cottage only — the cottage for three keeps 510524307, so
   * each row still has an exterior and no photograph is shown twice. */
  { id: '510529210', cat: 'cottageOut', room: ['familyCottage'], widths: TILE, portrait: true },
]

const byId = new Map(PHOTOS.map((p) => [p.id, p]))

/** Look one up by Booking id. Throws in development if the id is a typo, so a
 *  broken reference shows up here and not as a missing image in the hero. */
export function photo(id: string): Photo {
  const p = byId.get(id)
  if (!p) throw new Error(`nypugardar: no photo ${id}`)
  return p
}

/** The largest rendered width — what a full-bleed <img src> should point at. */
export const largest = (p: Photo) => src(p.id, p.widths[p.widths.length - 1])

/** srcset across every width that exists, so the browser picks by viewport. */
export const srcSet = (p: Photo) => p.widths.map((w) => `${src(p.id, w)} ${w}w`).join(', ')

/** Every photo Booking has filed under a room type, in manifest order. */
export function forRoom(key: GodoRoomKey): Photo[] {
  return PHOTOS.filter((p) => p.room?.includes(key))
}

/**
 * The one frame that best introduces a room type in a list: a bedroom if she
 * has one filed, and only then a cottage interior or an exterior. Never a
 * bathroom — a list of seven bathrooms is nobody's idea of a room list.
 */
export function leadFor(key: GodoRoomKey): Photo | null {
  const mine = forRoom(key)
  return (
    mine.find((p) => p.cat === 'room') ??
    mine.find((p) => p.cat === 'cottageIn') ??
    mine.find((p) => p.cat === 'cottageOut') ??
    null
  )
}

export function byCat(...cats: PhotoCat[]): Photo[] {
  return PHOTOS.filter((p) => cats.includes(p.cat))
}

/**
 * The gallery row for one room type: everything Booking files under it, minus
 * whatever the page has already shown — the frame the room list uses as that
 * row's thumbnail, and any frame promoted to a full-width feature above.
 *
 * `double` legitimately comes out at one tile. She has only uploaded two
 * photographs of that room type and the room list is already using one; the
 * answer is a photograph from her, not the same picture printed twice.
 */
export function galleryFor(key: GodoRoomKey, used: ReadonlySet<string>): Photo[] {
  const lead = leadFor(key)
  return forRoom(key).filter((p) => p.id !== lead?.id && !used.has(p.id))
}

/** Same rule for the non-room groups at the foot of the gallery. */
export function restFor(cats: PhotoCat[], used: ReadonlySet<string>): Photo[] {
  return byCat(...cats).filter((p) => !used.has(p.id))
}
