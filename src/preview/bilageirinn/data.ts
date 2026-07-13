/**
 * Bílageirinn ehf (Grófin 14a, 230 Reykjanesbær) — verified content only.
 * Facts confirmed on bilageirinn.is (their own logo spells Bílageirinn;
 * the old site <title> misspells it) plus DV.is 2019 (Toyota + Kia
 * authorization). Founded 2003 (parts/car import), 2004 bought property
 * for paint/bodywork, 2007 built and moved into a purpose-built 810 m²
 * facility. MD Björn Steinar Unnarsson is a certified Master Aircraft
 * Mechanic. CABAS damage assessment, works with every Icelandic insurer,
 * fixed-price self-pay quotes, loaner car during damage repairs, annual
 * staff training abroad on paint/repair materials. Member of
 * Bílgreinasambandið. No numbers or claims beyond these are used.
 */

export const NAME = 'Bílageirinn'
export const PHONE_DISPLAY = '421 6901'
export const PHONE_HREF = 'tel:+3544216901'
export const LUBE_PHONE_DISPLAY = '436 6901'
export const LUBE_PHONE_HREF = 'tel:+3544366901'
export const EMAIL = 'bilageirinn@bilageirinn.is'
export const ADDRESS = { street: 'Grófin 14a', town: '230 Reykjanesbær' }
export const MAPS = 'https://maps.google.com/?q=B%C3%ADlageirinn,+Gr%C3%B3fin+14a,+230+Reykjanesb%C3%A6r'

const ASSET = `${import.meta.env.BASE_URL}preview/bilageirinn/`
export const LOGO = `${ASSET}logo.png`

export const HOURS = [
  { days: 'Mánudaga til fimmtudaga', open: '08:00', close: '17:00' },
  { days: 'Föstudaga', open: '08:00', close: '15:00' },
  { days: 'Laugardaga og sunnudaga', open: 'Lokað', close: '' },
]

export const HERO = {
  headline: 'Aftur í rétta línu.',
  sub: 'Réttingar, bílamálun og bílaþjónusta í Reykjanesbæ. Nákvæmnin kemur úr fluginu, verkið vinnst í Grófinni.',
  cert: 'Viðurkennt þjónustuverkstæði fyrir Toyota og Kia',
  ctaPrimary: 'Hringja í 421 6901',
  ctaSecondary: 'Skoða þjónustuna',
}

/** Verified facts row — numbers count up on scroll into view. */
export const FACTS = [
  { num: 2003, pad: 4, suffix: '', label: 'Stofnár í Reykjanesbæ' },
  { num: 810, pad: 3, suffix: ' m²', label: 'Sérbyggt húsnæði í Grófinni' },
  { num: 2, pad: 1, suffix: '', label: 'Viðurkennd vörumerki' },
  { num: null, pad: 0, text: 'Öll', suffix: '', label: 'Tryggingafélög landsins' },
]

/**
 * Photography. logo/toyota/kia are the real marks harvested from
 * bilageirinn.is (they display the Toyota + Kia marks themselves).
 * Workshop photos are vetted FREE Unsplash (their old site only carries
 * 261×93 thumbnails; Unsplash+ premium ids are watermarked and banned):
 * hero JvmFL2FEE8Q · booth S2DAAfQQF4g · retting G6sI_6B_FFY ·
 * malun 2ssdrtw07dw · garage WbKt-WmdMf8 · lift FHrxSBfNzLw ·
 * polish z6o7bOvvalU · wheel fILglZMbipM · brake nr-9yu-ERTM ·
 * headlight VuYz3is9tPI.
 * None depict their actual facility, so no caption claims they do.
 */
export const IMG = {
  hero: `${ASSET}hero.webp`,
  malun: `${ASSET}malun.webp`,
  retting: `${ASSET}retting.webp`,
  booth: `${ASSET}booth.webp`,
  garage: `${ASSET}garage.webp`,
  lift: `${ASSET}lift.webp`,
  polish: `${ASSET}polish.webp`,
  wheel: `${ASSET}wheel.webp`,
  brake: `${ASSET}brake.webp`,
  headlight: `${ASSET}headlight.webp`,
  toyota: `${ASSET}toyota.png`,
  kia: `${ASSET}kia.png`,
}

export const TRUST_STRIP = [
  'Síðan 2003',
  '810 m² í Grófinni 14a',
  'Toyota- og Kia-viðurkenning',
  'Aðili að Bílgreinasambandinu',
  'CABAS-tjónamat',
]

export const STORY = {
  title: 'Nákvæmni úr flugskýlinu',
  lead:
    'Björn Steinar Unnarsson, framkvæmdastjóri Bílageirans, er meistari í flugvélavirkjun. Í flugvélaviðhaldi duga engar ágiskanir. Hvert mál er mælt, hvert handtak skráð og verkinu lýkur ekki fyrr en allt stenst kröfur. Sömu vinnubrögð gilda á gólfinu í Grófinni.',
  body:
    'Bíllinn þinn á eina rétta línu, þá sem hann kom með úr verksmiðjunni. Tjón færir hana úr stað. Okkar verk er að finna hana aftur og skila henni, mældri og staðfestri.',
  timeline: [
    { year: '2003', text: 'Bílageirinn stofnaður. Fyrstu árin snerust um innflutning á bílum og varahlutum.' },
    { year: '2004', text: 'Húsnæði keypt undir bílamálun og réttingar. Verkstæðið tekur á sig mynd.' },
    { year: '2007', text: 'Flutt í 810 fermetra húsnæði að Grófinni 14a, byggt frá grunni utan um starfsemina.' },
  ],
}

export interface Service {
  name: string
  desc: string
  tag: string
}

export const SERVICES: Service[] = [
  {
    name: 'Réttingar',
    desc: 'Tjónaviðgerðir af öllum stærðum. Yfirbyggingin er mæld, rétt af og yfirfarin þar til línan er komin á sinn stað.',
    tag: 'TJÓN · CABAS',
  },
  {
    name: 'Bílamálun',
    desc: 'Sprautun og frágangur í eigin málningardeild undir stjórn verkstjóra.',
    tag: 'EIGIN DEILD',
  },
  {
    name: 'Almennar viðgerðir',
    desc: 'Viðhald og viðgerðir svo bíllinn haldist í lagi á milli skoðana.',
    tag: 'VERKSTÆÐI',
  },
  {
    name: 'Smurstöð',
    desc: 'Olíuskipti og smurþjónusta. Smurstöðin hefur sína eigin símalínu.',
    tag: 'S. 436 6901',
  },
  {
    name: 'Hjólastilling',
    desc: 'Hjólabúnaðurinn stilltur svo bíllinn aki beint og dekkin slitni jafnt.',
    tag: 'STILLING',
  },
  {
    name: 'Ljósastilling',
    desc: 'Aðalljósin stillt svo þau lýsi veginn rétt, hvorki of hátt né of lágt.',
    tag: 'STILLING',
  },
  {
    name: 'Bremsu- og fjöðrunarprófun',
    desc: 'Ástand bremsa og fjöðrunar kannað og metið.',
    tag: 'PRÓFUN',
  },
]

export const BRANDS = {
  title: 'Viðurkennt fyrir Toyota og Kia',
  body:
    'Bílageirinn er viðurkennt þjónustuverkstæði fyrir Toyota og Kia. Fyrir eigandann þýðir það að viðhaldið er unnið eftir forskrift framleiðandans og þjónustusaga bílsins heldur gildi sínu, bæði gagnvart ábyrgð og við endursölu.',
  note: 'Aðrir bílar eru að sjálfsögðu jafn velkomnir í almenna þjónustu.',
}

export const CRAFT = {
  title: 'Handverk sem fylgist með efninu',
  body:
    'Efni í bílamálun og réttingum taka stöðugum breytingum. Þess vegna sækir starfsfólk Bílageirans árlega þjálfun erlendis hjá framleiðendum efnanna sem notuð eru á verkstæðinu. Nýjasta þekkingin skilar sér beint í sprautuklefann og á réttingabekkinn.',
  points: ['Árleg þjálfun erlendis', 'Efni frá viðurkenndum framleiðendum', 'Verkstjóri yfir málningardeild'],
}

export interface Step {
  title: string
  desc: string
  highlight?: boolean
}

export const CLAIM_STEPS: Step[] = [
  {
    title: 'Tjónið skoðað',
    desc: 'Þú hringir eða kemur við í Grófinni. Við förum yfir tjónið með þér.',
  },
  {
    title: 'CABAS-mat',
    desc: 'Tjónið er metið í CABAS, sama kerfi og tryggingafélögin nota. Greiðir þú sjálfur færðu fast verðtilboð.',
  },
  {
    title: 'Viðgerðin',
    desc: 'Rétting, málun og frágangur, unnið eftir matinu þar til línan er rétt.',
  },
  {
    title: 'Lánsbíll á meðan',
    desc: 'Þú færð lánsbíl hjá okkur á meðan tjónaviðgerðin stendur yfir. Hversdagurinn stoppar ekki.',
    highlight: true,
  },
]

export const INSURANCE = {
  title: 'Sama hvar þú ert með tryggingarnar',
  body:
    'Bílageirinn vinnur með öllum tryggingafélögum landsins og tjónamatið fer fram í kerfinu sem félögin sjálf nota. Þú þarft því ekki að velja verkstæði eftir tryggingafélagi.',
  companies: ['Vörður', 'VÍS', 'TM', 'Sjóvá', 'ABÍ'],
}

export interface Person {
  name: string
  role: string
  detail?: string
}

export const TEAM: Person[] = [
  {
    name: 'Björn Steinar Unnarsson',
    role: 'Framkvæmdastjóri',
    detail: 'Meistari í flugvélavirkjun',
  },
  { name: 'Ingibjörg Kristjánsdóttir', role: 'Skrifstofa' },
  { name: 'Brynjar Sigurðsson', role: 'Verkstjóri málningardeildar' },
]

export const FACILITY = {
  title: 'Sérbyggt utan um verkið',
  body:
    'Árið 2007 flutti Bílageirinn í 810 fermetra húsnæði að Grófinni 14a sem var byggt frá grunni utan um starfsemina. Réttingar, málun, smurstöð og almenn þjónusta eru öll undir sama þaki.',
}

export const CTA = {
  title: 'Byrjum á símtali',
  body: 'Þú lýsir tjóninu eða erindinu og við segjum þér nákvæmlega hvað gerist næst.',
}

export const SEO = {
  title: 'Bílageirinn — Réttingar, málun og þjónusta í Reykjanesbæ',
  description:
    'Bílageirinn í Reykjanesbæ: réttingar, bílamálun, smurstöð og almenn bílaþjónusta. Viðurkennt þjónustuverkstæði fyrir Toyota og Kia. CABAS-tjónamat, öll tryggingafélög og lánsbíll meðan á viðgerð stendur. Sími 421 6901.',
}
