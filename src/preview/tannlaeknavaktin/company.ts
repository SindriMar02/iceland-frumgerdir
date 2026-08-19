import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for tannlaeknavaktin. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
  slug: 'tannlaeknavaktin',
  route: '/preview/tannlaeknavaktin',
  name: 'Tannlæknavaktin',
  sector: 'Bráðaþjónusta tannlækna',
  location: 'Skipholt 33, 105 Reykjavík',
  region: 'Höfuðborgarsvæðið',
  established: 'Tannlæknavaktin ehf., kt. 521112-1230',
  currentUrl: 'https://www.tannlaeknavaktin.is',
  ownerEmail: 'tannlaeknavaktin@gmail.com',
  concept: 'Vaktin',
  conceptTagline:
    'Their own logo sets a tooth inside square brackets, and [ ] is interval notation: the notation for a span with a start and an end. This business is a time interval. So the page reads the real clock, answers "eru þið opin núna" in the hero before anyone scrolls, and its ground follows the actual time of day.',
  accent: '#E70104',
  dark: false,
  status: 'Concept ready',
  thumb: `${import.meta.env.BASE_URL}tannlaeknavaktin/logo.png`,
  photoCredit:
    'Myndirnar á síðunni eru tölvugerðar og eingöngu til skreytingar. Þær sýna hvorki húsnæði Tannlæknavaktarinnar né starfsfólk hennar. Merkið er þeirra eigið, af skráningu þeirra á ja.is. Opnunartími, verðskrá og starfsstöðvar eru sótt beint á tannlaeknavaktin.is 27. júlí 2026.',
  audit: {
    strengths: [
      'A genuinely needed service with unusually long hours: open to 22:00 on weekdays, 20:00 at weekends, with a dentist on call after 16:00 and all weekend',
      'They already publish a complete price list, including the 45.590 kr evening and weekend surcharge, which most emergency providers keep hidden',
      'Three named, licensed dentists across two locations, with the operating licence from Heilbrigðiseftirlit Reykjavíkur stated openly',
    ],
    weaknesses: [
      'The site has no viewport meta tag at all, so it does not scale on a phone, which is the only device most people reach it on',
      'Built on the Joomla beez_20 template, which shipped as the default in 2011, on a branch that stopped receiving security updates in December 2014',
      'Every appointment requires a phone call, the price list is buried in a submenu, and an image hotlinked from landlaeknir.is is broken on every page',
    ],
    opportunities: [
      'Answer the one question everyone has before they call: is it open right now, and where is the on-call dentist tonight',
      'Surface the 45.590 kr surcharge honestly and up front, before someone picks up the phone, which builds more trust than hiding it',
      'A competitor, tannhjalp.is, is already marketing against them on price with the line "ekkert komugjald"',
    ],
  },
  positioning:
    'The capital area dental emergency service, reachable only by telephone, through a website that does not work on a telephone. People arrive here in pain, one-handed, at night, and the current site answers none of their three questions: is it open, what will it cost, where do I go. The redesign is built entirely from facts they already publish and is keyed to the clock, so it answers all three before anyone scrolls.',
  outreach: {
    subject: 'Hugmynd að nýrri vefsíðu fyrir Tannlæknavaktina',
    body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Ég var að skoða tannlaeknavaktin.is og eitt stakk í augun. Þið eruð opin til klukkan 22 á virkum dögum og sinnið bráðatilvikum þegar flest annað er lokað, en vefsíðan aðlagast ekki símaskjám. Fólk með tannverk að kvöldi er nánast alltaf með símann í hendinni. Verðskráin ykkar er líka til staðar og vel útfyllt, en hún liggur það djúpt í valmyndinni að fæstir finna hana áður en þeir hringja.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Hún byggir alfarið á ykkar eigin upplýsingum, opnunartímanum, verðskránni og báðum starfsstöðvunum. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Síðan byrjar á að svara spurningunni sem allir spyrja fyrst, hvort það sé opið núna. Ég setti líka upp símsvara sem kann svörin ykkar. Prófið að spyrja hann hvað kostar að koma á kvöldin.

Ég sé einnig um hýsingu, viðhald og uppfærslur á þeim síðum sem ég geri, ef það er eitthvað sem þið hafið áhuga á.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þetta veiti ykkur smá innblástur.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
  },
}
