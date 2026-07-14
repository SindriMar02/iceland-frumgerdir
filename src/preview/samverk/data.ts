/**
 * Glerverksmiðjan Samverk (samverk.is) — verified content only.
 * Source: samverk.is + samverk.is/um-samverk (studied 2026-07-14, live browse) + web search
 * (founding date, "largest + oldest glass workshop in Iceland" claim, Google review count).
 * Real business: Iceland's oldest (founded 18.1.1969) and largest glass factory — insulated
 * glass, mirrors, shower enclosures, glass walls/doors, glass railings, tempered/fire/sound/
 * solar-control glass. Factory in Hella, showroom + sales office in Kópavogur.
 *
 * Real logo + 4 real product photos harvested directly from samverk.is (public/img/samverk/) —
 * these are genuine installation photography, not stock. The current site's actual HERO photo
 * is stock ("modern-glass-building-architecture..." filename) despite better real photos sitting
 * further down the page, and one AI-generated image is also present — neither is reused here.
 * Google reviews are real but mixed (3.3★/7 reviews, some complaints about installation/delays) —
 * deliberately NOT featured; no fabricated testimonials, no fabricated team (the site's own
 * "Starfsfólk" heading has no content behind it, so no team section is invented here either).
 */

export const PHONE_DISPLAY = '488 9000'
export const PHONE_HREF = 'tel:+3544889000'
export const EMAIL = 'samverk@samverk.is'

export const LOCATIONS = [
  {
    name: 'Sýningarsalur og söluskrifstofa',
    town: 'Kópavogur',
    address: 'Smiðjuvegur 2, 200 Kópavogur',
    maps: 'https://maps.google.com/?q=Smi%C3%B0juvegur+2,+200+K%C3%B3pavogur',
    hours: [{ day: 'Mánudaga til föstudaga', time: '8:00 – 17:00' }],
  },
  {
    name: 'Glerverksmiðja',
    town: 'Hella',
    address: 'Eyjasandur 2, 850 Hella',
    maps: 'https://maps.google.com/?q=Eyjasandur+2,+850+Hella',
    hours: [
      { day: 'Mánudaga til fimmtudaga', time: '8:00 – 16:00' },
      { day: 'Föstudaga', time: '8:00 – 15:00' },
    ],
  },
]

const A = `${import.meta.env.BASE_URL}img/samverk/`

export const IMG = {
  logo: `${A}logo.png`,
  glerveggur: `${A}glerveggur.jpg`,
  sturtugler: `${A}sturtugler.jpg`,
  glerhandrid: `${A}glerhandrid.jpg`,
  speglar: `${A}speglar.jpg`,
}

/** Real founding facts, from samverk.is/um-samverk + web search corroboration. */
export const FOUNDED_YEAR = 1969
export const FOUNDING_STORY =
  'Glerverksmiðjan Samverk var upphaflega stofnuð árið 1969 af átta heimamönnum í Rangárþingi og hefur staðið í fremstu röð í íslenskri glervinnslu síðan þá. Í dag er Samverk bæði elsta starfandi glerverksmiðja landsins og sú stærsta.'

/** Real quality/production facts, from samverk.is/um-samverk. */
export const QUALITY_BODY =
  'Í Samverk eru fullkomin framleiðslutæki sem hafa verið endurnýjuð á síðustu árum. Það gerir okkur kleift að takast á við flókin verkefni og framleiða gler í hæsta gæðaflokki. Fyrirtækið vinnur samkvæmt stöðlum sem tryggja að vörur standist kröfur um gæði og öryggi — CE-merking er viðurkennd staðfesting á tæknilegum eiginleikum glersins sem við framleiðum.'

/** Real installation-service copy, from samverk.is/uppsetning-og-maelingar. */
export const INSTALL_BODY =
  'Ísetning einangrunarglers skal alltaf vera unnin af fagmönnum — ending einangrunarglersins fer að mestu leyti eftir gæðum ísetningarinnar. Til að tryggja að rétt stærð af gleri sé framleitt í verkefnið mælum við með því að sérfræðingur Samverks skoði og meti aðstæður og mæli stærð glerja.'

/**
 * The interactive product index — only the 4 categories with a real photo get one.
 * The rest of Samverk's real range is listed as plain text below, honestly, rather than
 * matched to a photo that doesn't actually show it.
 */
export const PRODUCTS = [
  {
    key: 'glerveggur',
    name: 'Glerveggir og hurðir',
    body: 'Glerveggir og glerhurðir fyrir skrifstofur og verslunarrými — létt, opið og bjart rými án þess að gefa eftir í hljóðvist eða endingu.',
    img: IMG.glerveggur,
  },
  {
    key: 'sturtugler',
    name: 'Sturtugler',
    body: 'Sérsniðið sturtugler eftir máli, herslt öryggisgler sem þolir daglega notkun og raka.',
    img: IMG.sturtugler,
  },
  {
    key: 'glerhandrid',
    name: 'Glerhandrið',
    body: 'Glerhandrið fyrir svalir, stiga og milligólf — heldur útsýninu opnu án þess að gefa eftir í öryggi.',
    img: IMG.glerhandrid,
  },
  {
    key: 'speglar',
    name: 'Speglar',
    body: 'Speglar sérsniðnir eftir hönnun og stærð, sandblásnir eða heilir, fyrir heimili og fyrirtæki.',
    img: IMG.speglar,
  },
]

/** Additional real categories from samverk.is — no photo claimed for these. */
export const MORE_PRODUCTS = [
  'Einangrunargler',
  'Sólvarnargler',
  'Brunahelt gler',
  'Hljóðvarnargler',
  'Hert öryggisgler',
  'Sandblásið gler',
  'Málað gler',
  'Einfalt gler',
]
