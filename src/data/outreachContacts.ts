/**
 * Outreach system for the 5 newest redesigns (batch 4):
 * Sauðárkróksbakarí, 64° Reykjavik Distillery, Beffa Tours, Kogga, Háafell.
 *
 * Single source for the internal /outreach dashboard + OUTREACH.md. Every email
 * below was confirmed on a public source (sourceUrl) on 2026-06-21; none are
 * guessed. No private personal data. Nothing here is sent automatically — this
 * is for review and manual sending only.
 *
 * (The earlier batch-3 contacts — Austri, Lýsulaugar, Hespa, Reykkofinn,
 * Galdrasýning — still live in git history and in src/preview/companies.ts.)
 */

export type Confidence = 'high' | 'medium' | 'low'

export interface OutreachContact {
  id: string
  companyName: string
  /** empty if no public name was found (never guessed) */
  contactName: string
  contactRole: string
  /** confirmed public email, or '' if none was reliably found */
  email: string
  /** phone for reference if published, else '' */
  phone: string
  /** best non-email contact method (form/social) when email is '' or as a backup */
  contactUrl: string
  confidence: Confidence
  /** where the email/contact was actually seen */
  sourceUrl: string
  /** live preview of this company's redesign */
  previewUrl: string
  subject: string
  emailBody: string
  followUpSubject: string
  followUpBody: string
  notes: string
}

const PREVIEW = 'https://sindrimar02.github.io/iceland-frumgerdir/preview'

const SIGN = `Bestu kveðjur,
Sindri Már
845 1758`

const SIGN_SHORT = `Bestu kveðjur,
Sindri Már`

export const OUTREACH_CONTACTS: OutreachContact[] = [
  {
    id: 'saudarkroksbakari',
    companyName: 'Sauðárkróksbakarí',
    contactName: '',
    contactRole: '',
    email: 'saudarkroksbakari@gmail.com',
    phone: '455 5000',
    contactUrl: '',
    confidence: 'medium',
    sourceUrl: 'https://www.finna.is/fyrirtaeki/D7B5Ae/saudarkroksbakari',
    previewUrl: `${PREVIEW}/saudarkroksbakari`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Sauðárkróksbakarí',
    emailBody: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Sauðárkróksbakarí er eitt elsta bakarí landsins og sú saga á sér fáa líka. Þegar ég ætlaði að skoða vefsíðuna ykkar tók ég eftir að lénið saudarkroksbakari.net er ekki lengur virkt, svo gestir sem leita að ykkur eða smella á hlekk frá Tripadvisor lenda á annarri síðu. Það getur kostað ykkur heimsóknir á hverjum degi.

Mér fannst það synd, svo ég settist niður og hannaði frumgerð að nýrri forsíðu sem sýnir söguna, opnunartíma, vörurnar og hvar ykkur er að finna. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
${PREVIEW}/saudarkroksbakari

Ef ykkur líst vel á þetta getum við spjallað og fundið sanngjarnt verð. Ef ekki er ekkert mál, og ég vona að þetta veiti ykkur smá innblástur.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Sauðárkróksbakarí',
    followUpBody: `Góðan dag,

Ég sendi ykkur um daginn litla frumgerð að nýrri vefsíðu fyrir Sauðárkróksbakarí og vildi forvitnast hvort þið hefðuð náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá ykkur:
${PREVIEW}/saudarkroksbakari

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað ykkur fannst.

${SIGN_SHORT}`,
    notes:
      'Lénið saudarkroksbakari.net er útrunnið (vísar á sölusíðu). Gmail-netfangið er skráð í fyrirtækjaskrám (finna.is) og á Tripadvisor sem tengiliður bakaríisins, svo það er virka leiðin. Sími 455 5000, Aðalgata 5, 550 Sauðárkrókur.',
  },
  {
    id: 'reykjavikdistillery',
    companyName: '64° Reykjavik Distillery',
    contactName: '',
    contactRole: '',
    email: 'info@reykjavikdistillery.is',
    phone: '+354 519 3838',
    contactUrl: '',
    confidence: 'high',
    sourceUrl: 'https://reykjavikdistillery.is',
    previewUrl: `${PREVIEW}/reykjavikdistillery`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir 64° Reykjavik Distillery',
    emailBody: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki.

Það sem þið gerið hjá 64° Reykjavik Distillery er fallegt handverk, íslenskar jurtir tíndar í náttúrunni og settar í flösku. Þegar ég skoðaði vefsíðuna tók ég eftir að hvergi sjást verð á vörunum og engin bein leið er til að kaupa þær, sem getur orðið til þess að áhugasamir gestir hætta við áður en þeir komast lengra.

Mér fannst sagan og vörurnar eiga skilið betri umgjörð, svo ég hannaði frumgerð að nýrri vefsíðu sem setur jurtirnar og bragðið í forgrunn. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
${PREVIEW}/reykjavikdistillery

Ef ykkur líst vel á þetta getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir 64° Reykjavik Distillery',
    followUpBody: `Góðan dag,

Ég sendi ykkur um daginn litla frumgerð að nýrri vefsíðu fyrir 64° Reykjavik Distillery og vildi forvitnast hvort þið hefðuð náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá ykkur:
${PREVIEW}/reykjavikdistillery

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað ykkur fannst.

${SIGN_SHORT}`,
    notes:
      'Netfangið info@reykjavikdistillery.is er í Contact-hluta á reykjavikdistillery.is. Fjölskyldurekið, enginn einstaklingur nafngreindur. Sími +354 519 3838, Lónsbraut 6, 220 Hafnarfjörður.',
  },
  {
    id: 'beffatours',
    companyName: 'Beffa Tours',
    contactName: '',
    contactRole: '',
    email: 'info@harbourinn.is',
    phone: '+354 855 5006',
    contactUrl: 'https://beffatours.is',
    confidence: 'high',
    sourceUrl: 'https://beffatours.is',
    previewUrl: `${PREVIEW}/beffatours`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Beffa Tours',
    emailBody: `Góðan dag,

Ég heiti Sindri og hanna vefsíður fyrir íslenska ferðaþjónustu.

Beffa Tours býður upp á eitthvað sjaldgæft, hvalaskoðun á Arnarfirði með aðeins sjö gestum í einu. Þegar ég skoðaði vefsíðuna tók ég eftir að ekki er hægt að bóka ferð beint og verð koma hvergi fram, svo gestir sem vilja bóka utan opnunartíma eða erlendis frá leita oft annað þar sem svarið fæst strax.

Mér fannst upplifunin eiga skilið sterkari umgjörð, svo ég hannaði frumgerð að nýrri vefsíðu sem kynnir ferðina og gerir bókun einfalda. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
${PREVIEW}/beffatours

Ef ykkur líst vel á þetta getum við talað um sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Beffa Tours',
    followUpBody: `Góðan dag,

Ég sendi ykkur um daginn litla frumgerð að nýrri vefsíðu fyrir Beffa Tours og vildi forvitnast hvort þið hefðuð náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá ykkur:
${PREVIEW}/beffatours

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað ykkur fannst.

${SIGN_SHORT}`,
    notes:
      'info@harbourinn.is er eina netfangið á beffatours.is (notað í öllum bókunarhnöppum og síðufæti). Bókanir fara í gegnum Harbour Inn (rekstraraðila), svo netfangið er á því léni. Sími +354 855 5006, Dalbraut 1, 465 Bíldudalur.',
  },
  {
    id: 'kogga',
    companyName: 'Kogga',
    contactName: 'Kolbrún Björgólfsdóttir',
    contactRole: 'Eigandi og keramíklistakona',
    email: 'kogga@kogga.is',
    phone: '+354 552 6036',
    contactUrl: '',
    confidence: 'high',
    sourceUrl: 'https://www.kogga.is/contact',
    previewUrl: `${PREVIEW}/kogga`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Koggu',
    emailBody: `Sæl Kolbrún,

Ég heiti Sindri og hanna vefsíður fyrir íslenskt handverk og listafólk.

Keramíkverkin þín og innlagstæknin sem þú hefur þróað í fjörutíu ár eru einstök, og rauða húsið við Vesturgötu er staður sem fólk man eftir. Þegar ég skoðaði vefsíðuna tók ég eftir að gestir sjá ekki verð þegar þeir fletta verkunum og opnunartímar koma hvergi fram, sem getur valdið því að áhugasamir kaupendur og gestir gefist upp.

Mér fannst verkin eiga skilið umgjörð í sínum gæðaflokki, svo ég hannaði frumgerð að nýrri vefsíðu þar sem verkin og sagan fá að njóta sín. Þetta kostar þig ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
${PREVIEW}/kogga

Ef þér líst vel á þetta getum við fundið sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Koggu',
    followUpBody: `Sæl Kolbrún,

Ég sendi þér um daginn litla frumgerð að nýrri vefsíðu fyrir Koggu og vildi forvitnast hvort þú hefðir náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá þér:
${PREVIEW}/kogga

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað þér fannst.

${SIGN_SHORT}`,
    notes:
      'Netfangið kogga@kogga.is er á contact-síðu kogga.is. Kolbrún Björgólfsdóttir er eigandi og listakona, ávarpað með nafni og í eintölu. Sími +354 552 6036, gsm +354 899 2772, Vesturgata 5, 101 Reykjavík.',
  },
  {
    id: 'haafell',
    companyName: 'Háafell Geitfjársetur',
    contactName: 'Jóhanna B. Þorvaldsdóttir',
    contactRole: 'Ábúandi',
    email: 'geitur@geitur.is',
    phone: '+354 790 1548',
    contactUrl: '',
    confidence: 'high',
    sourceUrl: 'https://www.geitur.is',
    previewUrl: `${PREVIEW}/haafell`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Háafell Geitfjársetur',
    emailBody: `Sæl Jóhanna,

Ég heiti Sindri og hanna vefsíður fyrir íslensk fyrirtæki og ferðamannastaði.

Háafell er einstakur staður, eina geitfjársetrið á landinu og saga íslensku geitarinnar sem þið hafið bjargað frá útrýmingu. Þegar ég skoðaði vefsíðuna tók ég eftir að hún er aðeins á íslensku og að hlekkurinn til að panta vörur virkar ekki, svo erlendir gestir og þeir sem vilja versla komast ekki alla leið.

Mér fannst sagan ykkar eiga skilið að heyrast, svo ég hannaði frumgerð að nýrri vefsíðu á íslensku og ensku sem segir söguna, sýnir opnunartíma og verð og gerir heimsókn auðvelda. Þetta kostar ykkur ekki neitt og því fylgir engin skuldbinding.

Hana má skoða hér, og hún virkar vel í síma:
${PREVIEW}/haafell

Ef ykkur líst vel á þetta getum við talað um sanngjarnt verð. Ef ekki er ekkert mál.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Háafell',
    followUpBody: `Sæl Jóhanna,

Ég sendi ykkur um daginn litla frumgerð að nýrri vefsíðu fyrir Háafell og vildi forvitnast hvort þið hefðuð náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá ykkur:
${PREVIEW}/haafell

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað ykkur fannst.

${SIGN_SHORT}`,
    notes:
      'Netfangið geitur@geitur.is er í „Hafa samband“ á geitur.is. Jóhanna B. Þorvaldsdóttir er ábúandi, ávarpað með nafni. Sími +354 790 1548, Háafell, Hvítársíða, 320 Reykholt.',
  },
]
