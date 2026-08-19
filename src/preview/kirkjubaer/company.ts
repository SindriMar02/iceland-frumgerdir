import type { PreviewCompany } from '../company-types'
import { SIGN } from '../outreach-sign'

/**
 * Private brief + outreach copy for kirkjubaer. Kept in this folder (not in
 * the shared catalogue) so the preview route only ever ships its own
 * company data — see [[preview-link-isolation]].
 */
export const companyEntry: PreviewCompany = {
    slug: 'kirkjubaer',
    route: '/preview/kirkjubaer',
    name: 'Tjaldsvæðið Kirkjubær II',
    sector: 'Tjaldsvæði og sumarhús',
    location: 'Kirkjubæjarklaustur, Suðurland',
    region: 'South',
    established: 'Opið mars til nóvember',
    currentUrl: 'https://kirkjubaer.com',
    ownerEmail: 'kirkjubaer@simnet.is',
    concept: 'Friðsæl bækistöð',
    conceptTagline:
      'A peaceful base camp under the South Coast sky — warm, earthy and editorial, with the campsite’s own land doing the talking and the season status alive on the page.',
    accent: '#c2693f',
    dark: false,
    status: 'Concept ready',
    thumb: import.meta.env.BASE_URL + 'kirkjubaer/hero-glacier.jpg',
    audit: {
      strengths: [
        'Frábær staðsetning við Kirkjubæjarklaustur á þjóðvegi 1, miðja vegu á Suðurströndinni',
        'Bæði tjaldsvæði (fyrstur kemur, fyrstur fær) og sjö sumarhús fyrir fjóra',
        'Sterkir dómar á TripAdvisor og bókun sumarhúsa þegar komin í gegnum Airbnb',
      ],
      weaknesses: [
        'Vefsíðan er gömul (WordPress og Elementor) og virkar úrelt í dag',
        'Litlar myndir og veikt tungumálaval þar sem aðeins fánar skipta milli íslensku og ensku',
        'Ekkert innfellt kort og verð ásamt opnunartímum hvergi á einum skýrum stað',
      ],
      opportunities: [
        'Láta staðinn njóta sín með stórum myndum og hlýrri, jarðbundinni hönnun',
        'Skýrt verð, opnunartímar, kort og bein leið í bókun á sumarhúsum',
        'Almennileg tvítyngd síða á íslensku og ensku sem virkar fullkomlega í síma',
      ],
    },
    positioning:
      'Eitt best staðsetta tjaldsvæði Suðurlands á skilið vefsíðu sem stendur undir staðnum. Hlý, jarðbundin og ritstýrð hönnun lætur landið tala, sýnir lifandi opnunarstöðu eftir árstíma, og setur verð, kort og bókun þangað sem ferðafólk leitar raunverulega, bæði á íslensku og ensku.',
    outreach: {
      subject: 'Hugmynd að nýrri vefsíðu fyrir Tjaldsvæðið Kirkjubæ II',
      body: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Ég er einmitt gestur hjá ykkur á tjaldsvæðinu þessa dagana og er alveg heillaður. Friðsælt, hreint og dásamlega staðsett rétt hjá Kirkjubæjarklaustri, með allt Suðurlandið í seilingarfjarlægð. Það eina sem mér fannst ekki gera staðnum nógu góð skil var vefsíðan. Hún er orðin nokkuð gömul, myndirnar litlar, og það vantar bæði almennilegt kort og skýrar upplýsingar um opnunartíma og verð á einum stað.

Mér fannst það synd, svo á meðan ég dvel hér settist ég niður og hannaði frumgerð að nýrri vefsíðu fyrir ykkur. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér hvenær sem er, og hún virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld. Að ferðafólk finni ykkur, sjái hversu fallegur staðurinn er, viti strax hvenær er opið og hvað hlutirnir kosta, og rati til ykkar áreynslulaust. Síðan er bæði á íslensku og ensku. Ef ykkur líst vel á þetta gæti ég klárað vefinn í heild, en annars vona ég samt að þetta veiti ykkur smá innblástur.

Endilega heyrið í mér ef þetta kveikir í ykkur.

${SIGN}`,
    },
  }
