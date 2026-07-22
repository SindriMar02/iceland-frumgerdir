/**
 * Kauptún — Hjartað í þorpinu.
 * Every fact, name, quote and figure below is drawn ONLY from the verified
 * brief + dossier (re-verified 2026-07-22). No fabricated prices, no invented
 * delivery schedule, no fabricated reviews. The four owner quotes are real,
 * dated, attributed. Illustrative stock is labelled as such.
 */

const B = import.meta.env.BASE_URL

export const IMG = {
  storefront: `${B}kauptun/grant-2021.jpg`, // real Kauptún building, Jan 2021
  owners: `${B}kauptun/owners-2020.jpg`, // real current owners, June 2020
  harbor: `${B}kauptun/wiki-boat.jpg`, // Vopnafjörður harbour, trawler
  church: `${B}kauptun/wiki-church.jpg`, // Vopnafjörður church
  coastline: `${B}kauptun/wiki-town3.jpg`, // Vopnafjörður coastline
  bread: `${B}kauptun/unsplash-bread2.jpg`, // illustrative bakery texture (stock)
  coast: `${B}kauptun/unsplash-coast.jpg`, // illustrative Atlantic mood (stock)
} as const

export const CONTACT = {
  name: 'Kauptún',
  address: 'Hafnarbyggð 4',
  postal: '690 Vopnafjörður',
  phone: '473 1403',
  phoneHref: 'tel:+3544731403',
  email: 'kauptun@kauptun.net',
  mapsQuery: 'Kauptún, Hafnarbyggð 4, 690 Vopnafjörður',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=Kaupt%C3%BAn%20Hafnarbygg%C3%B0%204%20690%20Vopnafj%C3%B6r%C3%B0ur',
} as const

/** Opening hours, verified identical on two independent sources. */
export interface HourRow {
  label: string
  open: number | null // minutes from midnight, null = lokað
  close: number | null
  display: string
}

export const HOURS: HourRow[] = [
  { label: 'Mánudaga til föstudaga', open: 570, close: 1080, display: '09:30 - 18:00' },
  { label: 'Laugardaga', open: 720, close: 960, display: '12:00 - 16:00' },
  { label: 'Sunnudaga', open: null, close: null, display: 'Lokað' },
]

/** Full 7-day schedule, indexed by JS-style weekday (0=Sun .. 6=Sat). */
interface DayHours {
  open: number | null // minutes from midnight, null = lokað
  close: number | null
  ismark: string // Icelandic day name in the "á ..." form
}

const WEEK: DayHours[] = [
  { open: null, close: null, ismark: 'sunnudag' }, // 0 Sun
  { open: 570, close: 1080, ismark: 'mánudag' }, // 1 Mon
  { open: 570, close: 1080, ismark: 'þriðjudag' }, // 2 Tue
  { open: 570, close: 1080, ismark: 'miðvikudag' }, // 3 Wed
  { open: 570, close: 1080, ismark: 'fimmtudag' }, // 4 Thu
  { open: 570, close: 1080, ismark: 'föstudag' }, // 5 Fri
  { open: 720, close: 960, ismark: 'laugardag' }, // 6 Sat
]

const EN_TO_DOW: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

function minsToClock(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export interface OpenStatus {
  openNow: boolean
  detail: string
}

/**
 * Live "Opið núna / Lokað núna" computed against Iceland local time
 * (Atlantic/Reykjavik, UTC+0 year-round, no DST).
 */
export function computeStatus(now: Date): OpenStatus {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Atlantic/Reykjavik',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  const parts = fmt.formatToParts(now)
  const wd = parts.find((p) => p.type === 'weekday')?.value ?? 'Mon'
  const hh = Number(parts.find((p) => p.type === 'hour')?.value ?? '0')
  const mm = Number(parts.find((p) => p.type === 'minute')?.value ?? '0')
  const minutes = hh * 60 + mm
  const dow = EN_TO_DOW[wd] ?? 1
  const today = WEEK[dow]

  if (today.open !== null && today.close !== null && minutes >= today.open && minutes < today.close) {
    return { openNow: true, detail: `Opið til ${minsToClock(today.close)} í dag` }
  }

  // Still today but before opening?
  if (today.open !== null && minutes < today.open) {
    return { openNow: false, detail: `Opnar ${minsToClock(today.open)} í dag` }
  }

  // Walk forward over real calendar days to the next one that opens.
  for (let step = 1; step <= 7; step++) {
    const day = WEEK[(dow + step) % 7]
    if (day.open !== null) {
      const when = step === 1 ? 'á morgun' : `á ${day.ismark}`
      return { openNow: false, detail: `Opnar aftur ${when} kl. ${minsToClock(day.open)}` }
    }
  }
  return { openNow: false, detail: 'Lokað núna' }
}

/** Offerings — sourced from the municipal listing + já.is, no invented items. */
export const OFFERINGS = [
  {
    title: 'Matvörur',
    body: 'Dagvara og allt í matinn fyrir heimilin í firðinum, svo enginn þurfi að keyra 150 km eftir mjólk.',
    icon: 'basket',
  },
  {
    title: 'Heimabakað bakkelsi',
    body: 'Bakað á staðnum. Fjölskylduvæn verslun þar sem lyktin af nýbökuðu tekur á móti þér.',
    icon: 'croissant',
  },
  {
    title: 'Leikföng',
    body: 'Lítið úrval af leikföngum, hluti af því sem gerir Kauptún að meira en bara matvörubúð.',
    icon: 'blocks',
  },
  {
    title: 'Gjafavörur',
    body: 'Gjafavara þegar tilefnið kallar á það, án þess að panta að heiman og bíða í marga daga.',
    icon: 'gift',
  },
  {
    title: 'Heimilistæki',
    body: 'Heimilistæki og fleira til heimilisins, allt undir sama þaki á Hafnarbyggð 4.',
    icon: 'plug',
  },
] as const

/** The four real, dated, attributable owner quotes (Austurfrétt, 30.06.2020). */
export const QUOTES = {
  bigOne: 'Hér verði að vera búð, því hér búa 650 manns.',
  bigTwo: 'Að halda búðinni opinni þannig að fólk þurfi ekki að keyra 150 km eftir mjólk.',
  story:
    'Við ætlum að halda rekstrinum óbreyttum fyrst um sinn. Aðalmálið er að halda búðinni opinni.',
  storyTwo: 'Ég ætla ekki að halda því fram að þetta verði auðvelt en búðin hér hefur gengið.',
  attribution: 'Berghildur Fanney Oddsson Hauksdóttir',
  source: 'Austurfrétt, 30. júní 2020',
} as const
