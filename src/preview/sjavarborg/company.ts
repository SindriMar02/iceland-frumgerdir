import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for sjavarborg. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
/* ── Batch 11 ──────────────────────────────────────────────────────────── */

export const companyEntry: PreviewCompany = {
  slug: 'sjavarborg',
  route: '/preview/sjavarborg',
  name: 'Sjávarborg',
  sector: 'Gistiheimili & kaffihús',
  location: 'Hafnargata 4, Stykkishólmur',
  region: 'West',
  established: 'Íshús frá 1914, gistiheimili frá 2013',
  currentUrl: 'https://www.sjavarborg.is',
  ownerEmail: 'info@sjavarborg.is',
  concept: 'Borgin við sjóinn',
  conceptTagline:
    'One green harbour house that has been an ice store, a home, a shop and now a guesthouse with a café tells its own 110 years as the signature: a scroll-told heritage timeline where the building rebuilds itself through time, over the Breiðafjörður harbour it has always faced.',
  accent: '#B07A34',
  dark: false,
  status: 'Concept ready',
  thumb: 'https://images.unsplash.com/photo-1680766285771-6505e645d92f?q=80&w=1200&auto=format&fit=crop',
  photoCredit: 'Aðalmyndir af Stykkishólmi og Súgandisey eru af Unsplash; myndir af húsinu, herbergjum og kaffihúsinu eru af vef gistiheimilisins sjálfs (Sjávarborg / Harbour Hostel).',
  audit: {
    strengths: [
      'A genuinely distinctive asset: a green 1914 harbour house on the Stykkishólmur front, with a real 110-year story (ice store to home to shop to bookstore/barber/grocer to guesthouse) told in the operator’s own words',
      'A working guesthouse with single/double/twin/family rooms, a shared kitchen and a downstairs café (coffee, cakes, soup, wraps, vegan/GF), plus strong platform ratings (Tripadvisor 4/5 ~220, Booking 8.5, Trip.com 8.9)',
      'A postcard setting: Breiðafjörður, Súgandisey and the lighthouse out the window, five minutes from the Library of Water and the geothermal pool',
    ],
    weaknesses: [
      'A templated Duda builder site where the testimonial band renders empty placeholder graphics and the 1914 story is buried in one short paragraph with no visual heritage section',
      'No room prices anywhere; every booking intent is punted to an external engine, and the gallery is script-only with no crawlable images or alt text',
      'Confusing machine-slug navigation, a script-obfuscated email, and photography served at 455px even though larger renditions exist on their own CDN',
    ],
    opportunities: [
      'Make the 1914 ice-house the whole story: a scroll-told heritage timeline instead of a buried paragraph',
      'Put honest room types and platform ratings on-page and lead every path to their own booking engine, without inventing a fixed rate',
      'Serve their own photography at full size and give the harbour setting real editorial scale',
    ],
  },
  positioning:
    'Sjávarborg is a green 1914 harbour house in Stykkishólmur that has been an ice store, a home, a shop, a bookstore, a barber and a grocer before becoming a guesthouse with a café, always facing Breiðafjörður. All of that history and a postcard setting are trapped in a generic Duda template with empty testimonial placeholders, no prices and 455px photos. The redesign fixes a warm editorial serif on a cool fjord-slate world and tells the building’s 110 years as its signature moment, with honest room types, platform-cited ratings and every path leading to their own booking engine.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Sjávarborg',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk gistiheimili og ferðaþjónustu.

Ég kynnti mér Sjávarborg og það sem stóð upp úr var sagan af húsinu. Kjallarinn byggður 1914 sem íshús fyrir bátana, tvær hæðir ofan á 1938, síðan bókaverslun, rakarastofa og matvöruverslun, og loks gistiheimili með kaffihúsi. Sama húsið, fremst við höfnina, í meira en heila öld. Það er saga sem fá gistiheimili eiga.

Á vefnum í dag er hún hins vegar sögð í einni málsgrein. Umsagnahlutinn birtist tómur, með grárri mynd í stað dóma, myndirnar af herbergjunum eru bornar fram í 455 punkta breidd sem verður óskýrt á nútímaskjám, og hvergi sjást verð áður en fólk er sent yfir í bókunarkerfið.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Sagan af húsinu verður hjarta vefsins, þar sem hægt er að fara gegnum árin 1914, 1938, 2013 og fram til dagsins í dag. Herbergin fá almennilegar myndir, umsagnirnar koma frá Tripadvisor og Booking í stað tómra mynda, og allar leiðir liggja í ykkar eigið bókunarkerfi.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
