import type { PreviewCompany } from '../company-types'
import { PHOTOS } from './data'

/**
 * Rakararnir á Klapparstíg 40 — barbershop with no website at all.
 * `currentUrl` is their Facebook page, their only web presence, so the shared
 * footer is told it is their own page rather than an OTA listing.
 */
export const companyEntry: PreviewCompany = {
  slug: 'rakararnir',
  route: '/preview/rakararnir',
  name: 'Rakararnir á Klapparstíg 40',
  sector: 'Rakarastofa',
  location: 'Klapparstígur 40, 101 Reykjavík',
  region: 'Capital',
  established: 'Engin vefsíða',
  currentUrl: 'https://www.facebook.com/p/Rakararnir-%C3%A1-Klapparst%C3%ADg-40-100057750515735/',
  ownerEmail: '',
  concept: 'Hornið',
  conceptTagline:
    'Glerhornið á Klapparstíg: þeirra eigið gyllta skilti, græna bárujárnið og skiltið sem segir DROP INS WELCOME.',
  accent: '#A24E36',
  dark: false,
  status: 'Concept ready',
  thumb: PHOTOS.husid,
  noOwnSite: true,
  currentLabel: 'Facebook-síða fyrirtækisins',
  ownPhotography: true,
  photoCredit:
    'Ljósmyndir af stofunni, húsinu og glugganum eru raunverulegar myndir fyrirtækisins af Facebook-síðu þess. Nærmyndir af verkfærum og efni, og teiknuðu táknin, eru útbúnar fyrir þessa frumgerð og sýna ekki stofuna sjálfa.',
  audit: {
    strengths: [
      'Þeirra eigið handmálaða gyllta skilti á horninu er fullbúið vörumerki sem enginn annar á',
      'Skýr sérstaða: engin tímapöntun, DROP INS WELCOME stendur í glugganum',
      '100% meðmæli af 9 umsögnum og staðsetning í mestu gönguumferð miðborgarinnar',
    ],
    weaknesses: [
      'Engin vefsíða til, öll nærvera á netinu er ein Facebook-síða',
      'Opnunartími hvergi aðgengilegur án þess að opna Facebook',
      'Engin verðskrá og ekkert sem finnst í Google-leit á móti keppinautum sem eru allir með vefsíðu',
    ],
    opportunities: [
      'Ein síða sem svarar strax: er opið núna, hvar er stofan og hvað kostar klippingin',
      'Google-skráning fyrir „rakari 101 Reykjavík“ þar sem stofan er ósýnileg í dag',
      'Enskur texti fyrir ferðafólkið sem gengur fram hjá af Laugavegi',
    ],
  },
  positioning:
    'Rakarastofa á horni Klapparstígs sem tekur ekki við tímapöntunum og þarf þess ekki. Vefurinn á að segja hvort sé opið núna, hvað klippingin kostar og hvernig stofan lítur út, á tveimur tungumálum.',
  outreach: {
    subject: 'Framhald af símtalinu, hugmynd að vefsíðu',
    body: `Góðan dag,

Takk fyrir spjallið í símann áðan.

Ég heiti Sindri Már og er fastagestur hjá ykkur, sest alltaf í stólinn hjá Ellert. Í stuttu spjalli við hann komst ég að því að þið eruð ekki með vefsíðu, bara Facebook-síðuna, og að það gerir ykkur erfitt fyrir að ná til fólks, bæði í venjulegri Google-leit og þegar fólk leitar með gervigreind eins og ChatGPT. Það gæti þýtt að viðskiptavinir sem annars myndu finna ykkur, geri það einfaldlega ekki. Ég starfa við að hanna vefsíður, svo ég ákvað að setjast niður og gera frumgerð að vefsíðu fyrir ykkur, bara til að sýna hvað væri hægt að gera.

Þetta kostar ykkur ekkert og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ég byggði hana á ykkar eigin gyllta skilti og ykkar eigin myndum. Verðin sem standa þar eru sýnishorn, ég veit ekki réttu verðin ykkar, og það sama á við um opnunartímann sem ég las af skráningunni ykkar.

Ef þið viljið að ég klári vefinn með réttu upplýsingunum þá geri ég það, og ef ekki þá vona ég að þetta veiti smá innblástur.

Bestu kveðjur,
Sindri Már
845 1758
sndr-studio.pages.dev`,
  },
}
