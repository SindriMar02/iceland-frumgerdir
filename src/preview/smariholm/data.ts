/**
 * Prolan Bílaryðvörn Hjá Smára Hólm (smariholm.com) — verified content only.
 * Source: smariholm.com (studied 2026-07-13, live via headless browse) + en.ja.is/hja-smara-holm.
 * Real business: PROLAN lanolin-based rust protection for vehicles, run by Smári Hólm,
 * Suðurhella 10, Hafnarfjörður. The current site is a generic Wix template whose ENTIRE
 * image set is AI-generated ("ChatGPT Image ..." filenames found in the DOM, incl. the
 * photorealistic-looking underbody hero) — there is nothing real to harvest, so every photo
 * here is verified free-license Unsplash photography instead (see IMAGE-PROMPTS.md).
 */

export const PHONE_DISPLAY = '861 7237'
export const PHONE_HREF = 'tel:+3548617237'
export const EMAIL = 'prolan@prolan.is'
export const MAPS = 'https://maps.google.com/?q=Su%C3%B0urhella+10,+221+Hafnarfj%C3%B6r%C3%B0ur'
export const ADDRESS = { street: 'Suðurhella 10', town: '221 Hafnarfjörður' }

const U = (id: string, w: number) => `https://images.unsplash.com/photo-${id}?q=80&w=${w}&auto=format&fit=crop`

/**
 * All five verified free-to-use (Unsplash License, non-premium) — vetted on a contact
 * sheet before use. hero/craft/climate are real workshop + Iceland-winter-road photography;
 * rust is a real weathered-metal detail used purely as illustrative texture, not a claim
 * about any specific vehicle. tools is a real workbench detail shot for the "how it works"
 * section (neither smariholm.com nor prolan.is has a single real product/application photo —
 * every image on both is an AI-generated graphic — so this stays generic craft imagery
 * rather than implying it depicts a specific PROLAN can or process).
 */
export const IMG = {
  hero: (w = 2000) => U('1723099971299-3789db53604c', w),
  craft: (w = 1600) => U('1643700973089-baa86a1ab9ee', w),
  rust: (w = 1200) => U('1688701108480-0db760644684', w),
  climate: (w = 2000) => U('1751177204412-3e277708d81a', w),
  tools: (w = 1400) => U('1745449064670-94bd0fc13df8', w),
}

export const HOURS = [
  { day: 'Mánudaga til fimmtudaga', time: '10:00 – 17:00' },
  { day: 'Föstudaga', time: '10:00 – 16:00' },
  { day: 'Laugardaga og sunnudaga', time: 'Lokað' },
]

/** Real 6-item service list, from smariholm.com. */
export const SERVICES = [
  {
    name: 'Fullkomin ryðvarnarmeðferð',
    body: 'Fullkomin PROLAN ryðvörn fyrir undirvagn, grind og viðkvæm málmsvæði, til að verja gegn íslensku vegasalti, raka, möl og tæringu.',
  },
  {
    name: 'Holrúmsvax / innri ryðvörn',
    body: 'Vörn fyrir falin svæði þar sem ryð myndast gjarnan — hurðir, sauma, rammspor og innri holrúm — með gegnumrennandi lanólínformúlu.',
  },
  {
    name: 'Endurnýjun og viðhald',
    body: 'Endurnýjunar- og viðhaldsmeðferðir fyrir ökutæki sem áður hafa verið vernduð, svo langtímavörnin haldi ár eftir ár.',
  },
  {
    name: 'Sérbílar og þungavinnuvélar',
    body: 'Frá fólksbílum og jeppum til rúta, vinnuvéla, björgunarbifreiða og annarra sérökutækja sem þurfa áreiðanlega langtímavörn.',
  },
  {
    name: 'PROLAN vörusala',
    body: 'Fullt úrval af PROLAN vörum til kaups — úðar, smyrsl og sérhæfðar ryðvarnarlausnir fyrir bíla, sjó, iðnað og heimili.',
  },
  {
    name: 'Sérfræðiráðgjöf',
    body: 'Ekki viss hvaða PROLAN-vara hentar? Við veitum ráðgjöf um val og rétta meðferð fyrir þitt ökutæki eða verkefni.',
  },
]

/** Real coverage checklist, from smariholm.com. */
export const COVERAGE = [
  'Undirvagn og grind',
  'Hjólbogar og skítbretti',
  'Innri holrúm og rammaþættir',
  'Hurðasaumar, hengsli og læsingar',
  'Faldir karosseríhlutar og festingar',
  'Raftenglar og rakasækin íhluti',
]

/**
 * Real Google reviews, verified in the smariholm.com "Hvað viðskiptavinir okkar segja"
 * widget (14 reviews total). Real names + real dates, not invented.
 */
export const REVIEWS = [
  {
    name: 'Sigurður Pétur Jónsson',
    date: '23. september 2023',
    quote: 'Frábær þjónusta alltaf hjá Smára. Bílarnir hjá manni bara eldast ekki með prolan.',
  },
  {
    name: 'Arctic Trailblazers',
    date: '11. mars 2026',
    quote:
      'Virkilega vönduð og góð þjónusta. Allar tímasetningar stóðust og augljóst að starfsfólk hafði metnað fyrir því að veita úrvals þjónustu. Við þurftum að færa til bókaðan tíma og var það lítið vandamál þrátt fyrir annríki.',
  },
  {
    name: 'Haftor Hallsson',
    date: '25. júlí 2022',
    quote: 'Frábært efni.',
  },
  {
    name: 'Jörgen Pétur Lange Gudjonsson',
    date: '23. júlí 2024',
    quote: 'Frábær.',
  },
  {
    name: 'Kristinn Johann Olafsson',
    date: '2. mars 2024',
    quote: 'Góð þjónusta.',
  },
]
export const REVIEW_COUNT = 14

/** Real stat + warranty claims, quoted from smariholm.com. */
export const STAT_MULTIPLIER = '5'
export const STAT_BODY =
  'Óvernduð ökutæki í hörðu saltumhverfi geta orðið fyrir allt að fimm sinnum meiri mælanlegri tæringu undir vagnstelli en varin ökutæki.'
export const WARRANTY_YEARS = '10'
export const WARRANTY_BODY = 'Að hámarki 10 ára prófuð vernd á nýjum ökutækjum.'

/** Timeline captions for the drag scrubber signature — honest, qualitative, no invented data. */
export const TIMELINE = [
  { year: 0, label: 'Splunkunýtt', body: 'PROLAN-himnan myndast samstundis og lokar á raka og súrefni.' },
  { year: 2, label: 'Fyrstu vetur', body: 'Sveigjanlega himnan fylgir hverri hreyfingu bílsins — hún sprungur ekki eins og stífar húðanir.' },
  { year: 5, label: 'Miðja vegu', body: 'Enn full vernd á undirvagni, holrúmum og hurðasaumum, sama hversu oft bíllinn keyrir vegasalt.' },
  { year: 8, label: 'Að nálgast endurnýjun', body: 'Gott ráð að panta yfirferð svo verndin haldist óslitin.' },
  { year: 10, label: '10 ár', body: 'Efri mörk prófaðrar verndar á nýjum ökutækjum — tími fyrir endurnýjun hjá Prolan.' },
]

export const DIFFERENTIATOR =
  'Ólíkt stífum húðunum sem geta sprungið eða fangað raka með tímanum, helst PROLAN sveigjanlegt og sígur inn í sauma, liði, holrúm og staði sem hefðbundnar meðferðir ná oft ekki til.'
