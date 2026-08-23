import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for drangar. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'drangar',
    route: '/preview/drangar',
    name: 'Drangar Country Guesthouse',
    sector: 'Gistiheimili',
    location: 'Drangar, Skógarströnd, 371 Dalabyggð',
    region: 'West',
    established: 'Útihús frá því um 1980, endurbyggð 2014 til 2019, gistirekstur frá 2019',
    currentUrl: 'https://drangar.com',
    ownerEmail: 'drangar@drangar.com',
    concept: 'Húsin muna',
    conceptTagline:
      'Studio Granda kept every trace of what the farm was, so the page does too: a horizontal walk through the estate where the rooms wear their real tractor liveries, the copper ages from raw brown to Spanish green as you travel, and the 1980s state-blueprint gable morphs into the award-winning silhouette.',
    accent: '#B4372B',
    dark: false,
    status: 'Concept ready',
    thumb: 'https://cf.bstatic.com/xdata/images/hotel/max1280x900/253658330.jpg?k=6dabae8a22677d58f263938572ca5d2891ad37677c7a7396a53658584150e7dc',
    ownPhotography: true,
    audit: {
      strengths: [
        'A genuinely exceptional product: the Studio Granda renovation won the Icelandic Design Award 2020 and was nominated for the EU Mies van der Rohe Award 2022, and guests rate it 9.8 of 10 across 225 Booking.com reviews',
        'Real architectural photography already exists on their own channels: the tractor-livery rooms, the copper barn, the aquatic blue mosaic baths, the Breiðafjörður shore',
        'Premium pricing power, around 47 to 52 thousand kr per night for a 17 m² double, with live year-round availability',
      ],
      weaknesses: [
        'The current site is one static template page where the award-winning building sits at roughly one tenth opacity behind the text, effectively invisible',
        'Neither the Icelandic Design Award nor the Mies van der Rohe nomination is mentioned anywhere on the site',
        'Every one of the five call-to-action buttons sends guests to Booking.com, so a commission is paid on each booked night; there are no room pages, no story, and no Icelandic version',
      ],
      opportunities: [
        'Let the architecture carry the site: the rooms literally wear Kubota, New Holland, John Deere and Massey Ferguson liveries, a design language no other guesthouse in the country can claim',
        'Publish the award story with dates and credits, the strongest trust signal a design-led property can show',
        'Route direct inquiries to their own email alongside the Booking engine to win back commission on repeat and direct guests',
      ],
    },
    positioning:
      'Drangar is the rarest kind of candidate: a world-class product behind a website that hides it. Studio Granda spent six years turning standard 1980s farm buildings into one of the most celebrated renovations in Iceland, rooms glossed in real tractor liveries, a barn wrapped in copper that weathers from brown to Spanish green, and the current site shows a ghost of a photo and five identical Booking.com buttons. The prototype makes the page do what the architects did: keep the memory of the farm and let the buildings speak.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Dranga',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska gististaði.

Ég rakst á Dranga þegar ég var að skoða íslenska hönnun og staldraði við. Herbergin í traktoralitunum, koparklæðningin á fjósinu og Hönnunarverðlaun Íslands 2020 ofan á allt saman. Á vefsíðunni ykkar sést þetta samt hvergi. Myndin af húsunum er svo dauf að hún hverfur á bak við textann, verðlaunin eru ekki nefnd og allir hnapparnir senda gesti beint á Booking.com.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hún er hönnuð fyrir símann fyrst, því þar leita flestir ferðamenn, og virkar eins vel á tölvu. Herbergin fjögur fá hvert sinn lit, koparinn eldist úr brúnu yfir í spanskgrænu eftir því sem líður á síðuna og sagan á bak við húsin fær loksins pláss.

Svo er það leitin. Eins og staðan er í dag segir vefsíðan ykkar hvorki Google né gervigreind eins og ChatGPT að á Dröngum sé verðlaunað gistiheimili á Snæfellsnesi. Það vantar lýsingu á síðuna, fyrirsögn og þær upplýsingar sem tölvur lesa. Frumgerðin hefur þetta allt á hreinu, svo þið komið upp þegar fólk leitar að gistingu á svæðinu, hvort sem það er á Google eða í gervigreind.

Næsta skref væri svo bókunarkerfi beint á ykkar eigin síðu. Gestir sjá lausar nætur og fá staðfestingu strax, þið sæjuð allar bókanir á einum stað og hver bókun sem kemur beint til ykkar sleppur við þóknunina sem Booking tekur.

Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en ef ekki vona ég samt að þið hafið gaman af því að skoða hugmyndina.

Endilega látið mig vita ef þið hafið áhuga.

${SIGN}`,
    },
  }
