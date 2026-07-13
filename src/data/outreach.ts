/**
 * Sindri's Icelandic outreach emails — loaded ONLY when the send-preview
 * modal opens (dynamic import in SendPreview.tsx), so this text is not part
 * of the JavaScript bundle an owner's browser downloads on a direct link.
 *
 * Edit your email texts here. The string [HLEKKUR Á FRUMGERÐ] is replaced
 * live in the modal with the preview URL.
 *
 * Tone rules (keep them if you edit):
 * - short, personal, warm; no bullet lists, no marketing calques
 * - plural address throughout (ykkur/ykkar — never "Skoðaðu")
 * - one honest observation about the business, no flattery padding
 * - an explicit, easy no-pressure out at the end
 */

export interface OutreachEmail {
  subject: string
  body: string
}

const SIGNATURE = `Bestu kveðjur,
Sindri Már
845 1758`

export const outreach: Record<string, OutreachEmail> = {
  'ice-tourism': {
    subject: 'Ice Tourism — frumgerð að nýrri vefsíðu',
    body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Ég skoðaði vefsíðu Ice Tourism og mér fannst hún ekki endurspegla gæði þjónustunnar — sérsniðnar einkaferðir af þessu tagi eiga skilið sterkari framsetningu. Ég hannaði því að fyrra bragði frumgerð að nýrri forsíðu, ykkur að kostnaðarlausu.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Ef ykkur líst vel á hana væri gaman að heyra í ykkur og ræða hvernig fullbúin vefsíða gæti litið út. Ef þetta er ekki rétti tíminn er það að sjálfsögðu allt í lagi.

${SIGNATURE}`,
  },
  'daeli-farm': {
    subject: 'Dæli — frumgerð að nýrri vefsíðu',
    body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Dæli hefur eitthvað sem flest gistiheimili geta bara látið sig dreyma um: alvöru sveit, alvöru fjölskyldu og kyrrð sem gestir ferðast langt til að upplifa. Mér fannst vefsíðan ekki ná að miðla þessu — svo ég tók mig til og hannaði frumgerð að nýrri forsíðu, ykkur að kostnaðarlausu.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er einföld: að gestir finni fyrir sveitinni áður en þeir bóka — og bóki þá beint hjá ykkur frekar en gegnum bókunarsíður sem taka þóknun.

Ef ykkur líst vel á hana væri gaman að heyra í ykkur, og ég gæti þá klárað vefsíðuna í heild. Ef ekki, vona ég samt að hún veiti smá innblástur.

${SIGNATURE}`,
  },
  eldhestar: {
    subject: 'Eldhestar — frumgerð að nýrri vefsíðu',
    body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

Fá fyrirtæki hafa jafn sterkt efni í höndunum og Eldhestar: íslenska hestinn, jarðhitadalina og áratuga reynslu. Mér fannst núverandi vefsíða ekki fanga þetta til fulls, svo ég hannaði að fyrra bragði frumgerð að nýrri forsíðu — ykkur að kostnaðarlausu.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Markmiðið er að forsíðan fangi stemninguna í ferðunum sjálfum — og geri gestum auðvelt að bóka beint hjá ykkur.

Ef ykkur líst vel á stefnuna væri gaman að heyra í ykkur og ræða framhaldið. Ef ekki er það bara allt í lagi.

${SIGNATURE}`,
  },
  'guesthouse-carina': {
    subject: 'Guesthouse Carina — frumgerð að nýrri vefsíðu',
    body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk gistiheimili og ferðaþjónustufyrirtæki.

Guesthouse Carina fær frábærar umsagnir og er á einum besta stað landsins. En þegar gestir bóka gegnum Booking.com fer drjúgur hluti af verðinu í þóknun — og góð eigin vefsíða getur breytt því. Ég tók mig því til og hannaði frumgerð að nýrri forsíðu — ykkur að kostnaðarlausu.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Áherslan er á hlýja og persónulega framsetningu sem bókunarsíðurnar bjóða ekki upp á — og að gera gestum auðvelt að bóka beint hjá ykkur.

Ef ykkur líst vel á hana væri gaman að heyra í ykkur, og ég gæti þá klárað vefsíðuna í heild. Ef ekki er það að sjálfsögðu allt í lagi.

${SIGNATURE}`,
  },
  'gj-travel': {
    subject: 'GJ Travel — frumgerð að nýrri vefsíðu',
    body: `Góðan dag,

Sindri heiti ég og hanna vefsíður fyrir íslensk ferðaþjónustufyrirtæki.

GJ Travel á sér eina merkilegustu sögu íslenskrar ferðaþjónustu — yfir níutíu ár af ferðum um landið þvert og endilangt. Mér fannst núverandi vefsíða ekki gera þeirri sögu nógu hátt undir höfði, svo ég hannaði að fyrra bragði frumgerð að nýrri forsíðu — ykkur að kostnaðarlausu.

Hún er hér og virkar vel í síma:
[HLEKKUR Á FRUMGERÐ]

Hugmyndin er að láta söguna og reynsluna njóta sín — með nútímalegri framsetningu og einfaldari leið fyrir hópa og fyrirtæki að senda fyrirspurn.

Ef ykkur líst vel á stefnuna væri gaman að heyra í ykkur, og ég gæti þá klárað vefsíðuna í heild. Ef ekki er það að sjálfsögðu allt í lagi.

${SIGNATURE}`,
  },
}
