import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for beffatours. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'beffatours',
    route: '/preview/beffatours',
    name: 'Beffa Tours',
    sector: 'Whale watching',
    location: 'Bíldudalur, Arnarfjörður',
    region: 'Westfjords',
    established: 'Síðan 2018',
    currentUrl: 'https://beffatours.is',
    ownerEmail: 'info@harbourinn.is',
    concept: 'Sjö sæti á Arnarfirði',
    conceptTagline: 'Just seven guests on a 9-metre boat under the Westfjords Alps — stillness as the product.',
    accent: '#2c6b80',
    dark: true,
    status: 'Concept ready',
    thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
    audit: {
      strengths: [
        'Náin upplifun: einn 9 metra bátur, mest sjö gestir í einu',
        'Arnarfjörður undir Vestfjarðaölpunum, hnúfubakar algengastir',
        'Fjölskyldurekið frá 2018, heimamenn sem þekkja fjörðinn',
      ],
      weaknesses: [
        'Engin netbókun og engin verð, aðeins tölvupóstur',
        'Tölvupóstur fer á annað fyrirtæki (harbourinn.is) og einkanetfang',
        'Tvítekinn titill, ekkert sitemap og lítið efni fyrir leitarvélar',
      ],
      opportunities: [
        'Bein bókun með dagsetningu og sætum sýndum (sjö sæti = eftirsókn)',
        'Segja söguna um nándina sem stóru bátarnir geta ekki boðið',
        'Skýr verð, brottfarir og hvað fylgir, fyrir farsímann',
      ],
    },
    positioning:
      'Sjaldgæf, náin hvalaskoðun sem tapar bókunum í tölvupóstshlekk. Frumgerðin selur kyrrðina og gerir bókun á sæti einfalda.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Beffa Tours',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska ferðaþjónustu.

Beffa Tours býður upp á eitthvað sjaldgæft, hvalaskoðun á Arnarfirði með aðeins sjö gestum í einu. Þegar ég skoðaði vefsíðuna tók ég eftir að ekki er hægt að bóka ferð beint og verð koma hvergi fram, svo gestir sem vilja bóka utan opnunartíma eða erlendis frá leita oft annað þar sem svarið fæst strax.

Mér fannst upplifunin eiga skilið sterkari umgjörð, svo ég hannaði frumgerð að nýrri vefsíðu sem kynnir ferðina og gerir bókun einfalda. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á þetta getum við talað um sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    },
  }
