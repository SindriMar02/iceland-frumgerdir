/**
 * Outreach system for the 5 newest redesigns (batch 3).
 *
 * Separate from src/data/outreach.ts (which holds the batch-1 tourism emails used
 * by the SendPreview modal). This file is the single source for the internal
 * /outreach dashboard + OUTREACH.md.
 *
 * RULES honoured: every email below was seen verbatim on the company's own public
 * site (sourceUrl); none are guessed. No private personal data. Austri has no
 * reliably-transcribable email, so its contactUrl is the official Instagram and
 * the phone is given for reference. Weider is excluded. Nothing here is sent
 * automatically; this is for review and manual sending only.
 *
 * The signature phone is left as the literal placeholder "[símanúmer]" because
 * Sindri's number is not on file; fill it before sending.
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

Sindri Már Sigurðsson
[símanúmer]
sindrimar02@gmail.com`

const SIGN_SHORT = `Bestu kveðjur,
Sindri Már Sigurðsson`

export const OUTREACH_CONTACTS: OutreachContact[] = [
  {
    id: 'austri',
    companyName: 'Austri Brugghús',
    contactName: '',
    contactRole: '',
    email: '',
    phone: '456 7898',
    contactUrl: 'https://www.instagram.com/austribrugghus/',
    confidence: 'low',
    sourceUrl: 'https://austurland.is/framleidandi/austri-brugghus/',
    previewUrl: `${PREVIEW}/austri`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Austra Brugghús',
    emailBody: `Góðan dag,

Ég heiti Sindri Már og ég hanna og smíða vefsíður fyrir íslensk fyrirtæki.

Mér finnst virkilega skemmtilegt það sem þið hafið byggt upp fyrir austan, fyrsta brugghús Austfjarða, og ekki síst hvernig bjórarnir eru nefndir eftir fjöllunum og kennileitunum í kring. Það er saga sem á heima á vef.

Ég tók mér það bessaleyfi að setja saman litla frumgerð að nýrri vefsíðu fyrir ykkur, því mér fannst vörumerkið og sagan eiga skilið að njóta sín á netinu.

Hana má skoða hér:
${PREVIEW}/austri

Hugmyndin er einföld. Að fólk finni ykkur, kynnist sögunni á bak við hvern bjór og sjái auðveldlega hvar hægt er að smakka hann. Síðan er hönnuð til að líta vel út í síma og gefa sterka fyrstu sýn.

Þetta er að sjálfsögðu alveg skuldbindingarlaust, en ef ykkur líst vel á hugmyndina væri mjög gaman að heyra frá ykkur.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Austra',
    followUpBody: `Góðan dag,

Ég sendi ykkur um daginn litla frumgerð að nýrri vefsíðu fyrir Austra og vildi forvitnast hvort þið hefðuð náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá ykkur:
${PREVIEW}/austri

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað ykkur fannst.

${SIGN_SHORT}`,
    notes:
      'Ekkert staðfest netfang. Netfangsreitur á austurland.is gaf þrjár ólíkar útgáfur við lestur (sala@/info@/austri@), svo ekkert var skráð. Netfang er líklega til á léninu @austribrugghus.is. Besta leiðin er Instagram skilaboð (@austribrugghus) eða sími 456 7898. Staðfestu netfangið handvirkt áður en sent er.',
  },
  {
    id: 'lysulaugar',
    companyName: 'Lýsulaugar',
    contactName: '',
    contactRole: '',
    email: 'lysulaugar@snb.is',
    phone: '+354 433 9917',
    contactUrl: 'https://www.facebook.com/lysulaugar',
    confidence: 'high',
    sourceUrl: 'https://lysulaugar.is',
    previewUrl: `${PREVIEW}/lysulaugar`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Lýsulaugar',
    emailBody: `Góðan dag,

Ég heiti Sindri Már og ég hanna og smíða vefsíður fyrir íslensk fyrirtæki.

Lýsulaugar eru sannarlega sérstakar. Græna steinefnavatnið ykkar á sér fáa líka og umhverfið undir Snæfellsjökli er einstakt. Þetta er staður sem fólk man eftir.

Ég tók mér það bessaleyfi að setja saman litla frumgerð að nýrri vefsíðu fyrir ykkur, því mér fannst upplifunin eiga skilið að sjást betur á netinu.

Hana má skoða hér:
${PREVIEW}/lysulaugar

Markmiðið er að láta vatnið og náttúruna njóta sín, og um leið gera gestum auðvelt að sjá opnunartíma, verð og hvernig á að finna ykkur. Síðan er hönnuð til að virka vel í síma, þar sem flestir fletta ykkur upp á leiðinni.

Þetta er að sjálfsögðu alveg skuldbindingarlaust, en ef ykkur líst vel á hugmyndina væri mjög gaman að heyra frá ykkur.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Lýsulaugar',
    followUpBody: `Góðan dag,

Ég sendi ykkur um daginn litla frumgerð að nýrri vefsíðu fyrir Lýsulaugar og vildi forvitnast hvort þið hefðuð náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá ykkur:
${PREVIEW}/lysulaugar

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað ykkur fannst.

${SIGN_SHORT}`,
    notes:
      'Netfangið lysulaugar@snb.is er í síðufæti á lysulaugar.is (lénið @snb.is, líklega sameiginlegt Snæfellsbæjarlén). Almennt netfang fyrirtækisins, enginn eigandi nafngreindur á síðunni. Sími +354 433 9917.',
  },
  {
    id: 'hespa',
    companyName: 'Hespa (Hespuhúsið)',
    contactName: 'Guðrún Bjarnadóttir',
    contactRole: 'Eigandi og jurtalitari',
    email: 'hespa@hespa.is',
    phone: '+354 865 2910',
    contactUrl: '',
    confidence: 'high',
    sourceUrl: 'https://hespa.is/en/hespuhusid',
    previewUrl: `${PREVIEW}/hespa`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Hespu',
    emailBody: `Sæl Guðrún,

Ég heiti Sindri Már og ég hanna og smíða vefsíður fyrir íslensk fyrirtæki og handverksfólk.

Jurtalitaða ullin þín er einstaklega falleg og það er heillandi saga að litirnir komi beint úr íslenskri náttúru. Handverk af þessu tagi á sannarlega skilið fallega umgjörð.

Ég tók mér það bessaleyfi að setja saman litla frumgerð að nýrri vefsíðu fyrir Hespu, þar sem litirnir sjálfir fá að vera í aðalhlutverki.

Hana má skoða hér:
${PREVIEW}/hespa

Hugmyndin er að segja söguna á bak við litunina, sýna garnið eins vel og það á skilið, og gera fólki auðvelt að versla beint hjá þér. Síðan virkar líka vel í síma.

Þetta er að sjálfsögðu alveg skuldbindingarlaust, en ef þér líst vel á hugmyndina væri mjög gaman að heyra frá þér.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Hespu',
    followUpBody: `Sæl Guðrún,

Ég sendi þér um daginn litla frumgerð að nýrri vefsíðu fyrir Hespu og vildi forvitnast hvort þú hefðir náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá þér:
${PREVIEW}/hespa

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað þér fannst.

${SIGN_SHORT}`,
    notes:
      'Netfangið hespa@hespa.is er á hespa.is og ensku síðunni /en/hespuhusid (bæði eigenda- og almennt netfang, þar sem þetta er eins manns vinnustofa). Guðrún Bjarnadóttir er jurtalitari og eigandi. Ávarpað í eintölu og með nafni. Sími +354 865 2910.',
  },
  {
    id: 'reykkofinn',
    companyName: 'Reykkofinn (Litla sveitabúðin)',
    contactName: '',
    contactRole: '',
    email: 'hella@hangikjot.is',
    phone: '848 4237',
    contactUrl: '',
    confidence: 'high',
    sourceUrl: 'https://www.hangikjot.is/is/litla-sveitabudin',
    previewUrl: `${PREVIEW}/reykkofinn`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Reykkofann',
    emailBody: `Góðan dag,

Ég heiti Sindri Már og ég hanna og smíða vefsíður fyrir íslensk matvælafyrirtæki og sveitabúðir.

Heimareykt hangikjöt og lambakjöt beint frá býli á Hellu er nákvæmlega sú saga sem fólk vill heyra, og reyktur silungur þegar vel viðrar setur punktinn yfir i-ið. Þetta er ekta og það skilar sér.

Ég tók mér það bessaleyfi að setja saman litla frumgerð að nýrri vefsíðu fyrir ykkur, því mér fannst hráefnið og heimavinnslan eiga skilið að njóta sín á netinu.

Hana má skoða hér:
${PREVIEW}/reykkofinn

Markmiðið er að láta söguna og afurðirnar njóta sín, og gera fólki einfalt að panta eða koma við í sveitabúðinni. Síðan er hönnuð til að virka vel í síma.

Þetta er að sjálfsögðu alveg skuldbindingarlaust, en ef ykkur líst vel á hugmyndina væri mjög gaman að heyra frá ykkur.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Reykkofann',
    followUpBody: `Góðan dag,

Ég sendi ykkur um daginn litla frumgerð að nýrri vefsíðu fyrir Reykkofann og vildi forvitnast hvort þið hefðuð náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá ykkur:
${PREVIEW}/reykkofinn

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað ykkur fannst.

${SIGN_SHORT}`,
    notes:
      'Netfangið hella@hangikjot.is er á hangikjot.is (forsíða, Litla sveitabúðin og um-okkur síður). Almennt netfang, enginn eigandi nafngreindur í texta síðunnar (vefleit nefndi nöfn en þau sáust ekki á síðunni sjálfri, svo þau eru ekki skráð). Símar 848 4237 og 896 4237.',
  },
  {
    id: 'galdrasyning',
    companyName: 'Galdrasýning á Ströndum',
    contactName: 'Anna Björg Þórarinsdóttir',
    contactRole: 'Framkvæmdastjóri, Strandagaldur ses.',
    email: 'galdrasyning@holmavik.is',
    phone: '+354 897 6525',
    contactUrl: '',
    confidence: 'high',
    sourceUrl: 'https://www.galdrasyning.is/um-okkur',
    previewUrl: `${PREVIEW}/galdrasyning`,
    subject: 'Hugmynd að nýrri vefsíðu fyrir Galdrasýninguna',
    emailBody: `Sæl Anna Björg,

Ég heiti Sindri Már og ég hanna og smíða vefsíður fyrir íslensk fyrirtæki og söfn.

Galdrasýningin á Ströndum er einstök. Það er fátt sem fangar íslenska þjóðtrú og sögu galdramanna eins vel, og staðsetningin á Hólmavík gerir hana enn eftirminnilegri.

Ég tók mér það bessaleyfi að setja saman litla frumgerð að nýrri vefsíðu fyrir sýninguna, því mér fannst dulúðin og sagan eiga skilið sterka umgjörð á netinu.

Hana má skoða hér:
${PREVIEW}/galdrasyning

Hugmyndin er að láta stemninguna njóta sín strax á forsíðunni, og um leið gera gestum auðvelt að sjá opnunartíma og finna leiðina að miðakaupum. Síðan er hönnuð til að virka vel í síma.

Þetta er að sjálfsögðu alveg skuldbindingarlaust, en ef þér líst vel á hugmyndina væri mjög gaman að heyra frá þér.

${SIGN}`,
    followUpSubject: 'Stutt eftirfylgni, vefsíða fyrir Galdrasýninguna',
    followUpBody: `Sæl Anna Björg,

Ég sendi þér um daginn litla frumgerð að nýrri vefsíðu fyrir Galdrasýninguna og vildi forvitnast hvort þú hefðir náð að líta á hana.

Hér er hlekkurinn aftur ef hann fór framhjá þér:
${PREVIEW}/galdrasyning

Engin pressa, mér þætti einfaldlega vænt um að heyra hvað þér fannst.

${SIGN_SHORT}`,
    notes:
      'Netfangið galdrasyning@holmavik.is er á galdrasyning.is (forsíða og um-okkur). Anna Björg Þórarinsdóttir er framkvæmdastjóri (Strandagaldur ses.). Persónulegt Gmail hennar er einnig birt á um-okkur síðunni en hér er valið opinbera safnsnetfangið frekar en einkanetfang. Aðalsími +354 897 6525.',
  },
]
