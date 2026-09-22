/**
 * v2 "True Line" bilingual strings. Icelandic is the original language and
 * the source of truth: the shared content objects live in data.ts (used by
 * all four concept builds) and are referenced here, never duplicated. The
 * English side is a hand-written mirror of the same verified facts — no
 * claim exists in EN that doesn't exist in IS.
 */
import {
  BRANDS,
  CLAIM_STEPS,
  CRAFT,
  CTA,
  FACILITY,
  FACTS,
  HERO,
  HOURS,
  INSURANCE,
  SERVICES,
  STORY,
  TEAM,
  TRUST_STRIP,
} from './data'

export type Lang = 'is' | 'en'

/** Real customer reviews, captured verbatim 2026-07-21 from the shop's public
 *  Google Maps listing (4.1/21 reviews then; 4.0/23 on 2026-09-22, Sandra and
 *  Lorena re-read verbatim on the listing that day; originals read with
 *  hl=is so Icelandic quotes are the reviewers' own words) and Facebook page
 *  (86% recommend, 6 reviews in July; login-walled since, so no percentage
 *  is shown any more). Only 5-star/recommend entries with prose are used. EN versions of Icelandic quotes are translations (marked in UI);
 *  Lorena wrote in English originally. NEVER add a quote that can't be found
 *  on the live listing. */
export interface Review {
  name: string
  source: 'Google' | 'Facebook'
  quote: string
  translated?: boolean
}

const IS = {
  hero: HERO,
  story: STORY,
  services: SERVICES,
  brands: BRANDS,
  craft: CRAFT,
  claimSteps: CLAIM_STEPS,
  insurance: INSURANCE,
  team: TEAM,
  facility: FACILITY,
  cta: CTA,
  facts: FACTS,
  hours: HOURS,
  trust: TRUST_STRIP,
  ui: {
    slogan: 'Eins og ekkert hefði í skorist.',
    heroKicker: 'Réttingar · Bílamálun · Bílaþjónusta · Grófin 14a, Reykjanesbær',
    /* the full line wraps to three amber rows on a phone — too loud for a hero */
    heroKickerShort: 'Réttingar · Bílamálun · Grófin 14a',
    proofRow: [
      'Viðurkennt þjónustuverkstæði fyrir Toyota og Kia',
      'Öll tryggingafélög og CABAS-tjónamat',
      'Bíll á meðan viðgerð stendur',
    ],
    contactCta: 'Hafðu samband',
    navServices: 'Þjónusta',
    navClaims: 'Tjónaviðgerðir',
    navWorkshop: 'Verkstæðið',
    navTopAria: 'Bílageirinn, efst á síðu',
    menuOpen: 'Opna valmynd',
    menuClose: 'Loka valmynd',
    /* their own line: "Allt á einum stað." on bilageirinn.is/?page_id=4 and
       the DV 2019 headline "Allt á einum stað fyrir bílinn þinn" */
    servicesTitle: 'Allt á einum stað fyrir bílinn þinn',
    selfPayPre: 'Greiðir þú sjálfur? Tjónið er metið í CABAS og þú færð ',
    selfPayBold: 'fast verðtilboð',
    selfPayPost: '.',
    lubeAnswers: 'Smurstöðin svarar beint í síma',
    claimsClose: 'Allt byrjar á einu símtali:',
    certLabel: 'Viðurkennt',
    hoursLabel: 'Opnunartími',
    locationLabel: 'Staðsetning',
    mapTitle: 'Finndu okkur í Grófinni',
    footerOnPage: 'Á síðunni',
    footerContact: 'Hafa samband',
    footerCompany: 'Bílageirinn ehf · Kt. 460803-2410',
    footerLube: 'Smurstöð',
    mapIframeTitle: 'Staðsetning Bílageirans á korti',
    openMaps: 'Opna í Google Maps',
    lubeLabel: 'Smurstöðin:',
    hoursStrip: 'Mán–fim 08:00–17:00 · Fös 08:00–15:00 · Lokað um helgar',
    /* footer spec list: one line per row, same order as HOURS */
    hoursShort: ['Mán–fim', 'Fös', 'Lau–sun'],
    formKicker: 'Viltu frekar skrifa?',
    formTitle: 'Sendu okkur línu',
    formIntro: 'Fyrir almennar fyrirspurnir. Ef tjónið er nýtt eða brýnt er fljótlegast að hringja.',
    fieldName: 'Nafn',
    fieldPhone: 'Sími',
    fieldPlate: 'Bílnúmer',
    fieldService: 'Tegund þjónustu',
    fieldMessage: 'Nánar um erindið',
    optional: '(valfrjálst)',
    namePlaceholder: 'Jón Jónsson',
    phonePlaceholder: 't.d. 555 5555',
    platePlaceholder: 'AB 123',
    messagePlaceholder: 'Segðu okkur hvað gerðist eða hvað þú þarft…',
    selectPlaceholder: 'Veldu þjónustu',
    submit: 'Senda skilaboð',
    sending: 'Sendi…',
    sentNotice: 'Póstforritið þitt er að opnast með skilaboðin tilbúin. Þú klárar með því að ýta á senda.',
    recoveryQ: 'Opnaðist ekkert póstforrit?',
    copyMsg: 'Afrita skilaboðin',
    copied: 'Afritað',
    orCall: 'Eða hringdu í',
    backToForm: 'Til baka í formið',
    formError: 'Fylltu út nafn og síma og veldu tegund þjónustu.',
    mailSubject: 'Fyrirspurn af vefnum',
    mailName: 'Nafn',
    mailPhone: 'Sími',
    mailPlate: 'Bílnúmer',
    mailService: 'Tegund þjónustu',
    mailNotProvided: '(ekki gefið upp)',
    mailNoMessage: '(engin frekari lýsing)',
    specPlate: ['MÆLT', 'SKRÁÐ', 'STENST KRÖFUR'],
    measurePoint: 'Mælipunktur',
    referenceLine: 'Viðmiðunarlína',
    paintAlt: 'Unnið við bíl í málningarklefa',
    polishAlt: 'Lakk fægt á dökku húddi með fægivél',
    headlightAlt: 'Aðalljós á dökkum bíl í myrkri',
    garageAlt: 'Bílar á lyftum á dimmu verkstæðisgólfi',
    boothAlt: 'Bíll afmarkaður með pappír og grunnaður í sprautuklefa',
    reviewsTitle: 'Það sem viðskiptavinir segja',
    /* re-read on Google Maps 2026-09-22: 4,0 · 23 umsagnir (was 4,1 · 21 on
       2026-07-21). The Facebook "86% mæla með" line is gone: the page is
       login-walled now and a 6-review percentage cannot be re-verified. */
    reviewsGoogle: '4,0 af 5 · 23 umsagnir á Google',
    reviewsSource: 'Orðréttar umsagnir af Google og Facebook.',
    reviewsOpenGoogle: 'Sjá allar umsagnir á Google',
    reviewsTranslatedNote: 'þýdd umsögn',
    readMore: 'Lesa meira',
    readLess: 'Sýna minna',
    reviews: [
      {
        name: 'Sandra Winbush',
        source: 'Google',
        quote: 'Fæ alltaf frábæra þjónustu frá þeim, get ekki mælt meira með þeim!',
      },
      {
        name: 'Þorfinnur Kristinn Árnason',
        source: 'Google',
        quote: 'Topp þjónusta á sanngjörnu verði!',
      },
      {
        name: 'Bjarney Kolbrún Garðarsdóttir',
        source: 'Facebook',
        quote:
          'Lenti í vandræðum með bílinn minn á leiðinni frá Reykjavik og á flugvöllinn þar sem hann bilaði skyndilega. Náði að skila af mér flugfarþegunum og var svo heppin að ég náði á þetta verkstæði og betra viðmóti og þjónustu hef ég varla kynnst. Þeir löguðu bílinn og voru líka mjög sanngjarnir í verðlagningu.',
      },
      {
        name: 'Kjartan Árni',
        source: 'Google',
        quote: 'Topp þjónusta, fljótir og vinalegir',
      },
      {
        name: 'Lorena Vargas Ramos',
        source: 'Google',
        quote:
          'Excellent service, I made the appointment and they fix on time the windshield, they fix papers with insurance you don’t paid anything in the moment and later I’ll receive the invoice for my insurance company.',
      },
      {
        name: 'Atli Jóhannsson',
        source: 'Google',
        quote: 'Vönduð vinnubrögð',
      },
      {
        name: 'Thorkell Halldorsson',
        source: 'Google',
        quote: 'Topp þjónusta',
      },
    ] as Review[],
    heroAlts: [
      'Neistaflug við málmvinnu á dimmu verkstæði',
      'Bíll afmarkaður og grunnaður í sprautuklefa',
      'Bílar á lyftum á dimmu verkstæðisgólfi',
    ],
    serviceAlts: [
      'Flötur yfirbyggingar varinn og unninn með höndunum',
      'Sprautuvinna í málningarklefa',
      'Verkstæðisgólf með bílum í viðgerð',
      'Unnið undir bíl á lyftu',
      'Fjöðrunar- og hjólabúnaður í nærmynd',
      'Aðalljós á dökkum bíl',
      'Bremsubúnaður skoðaður með hjólið af',
    ],
  },
}

const EN: typeof IS = {
  hero: {
    headline: 'Back to its true line.',
    sub: 'Auto body repair, paint and car service in Reykjanesbær. The precision comes from aviation. The work is done in Grófin.',
    cert: 'Authorized service center for Toyota and Kia',
    ctaPrimary: 'Call 421 6901',
    ctaSecondary: 'View our services',
  },
  story: {
    title: 'Precision from the hangar',
    lead:
      'Björn Steinar Unnarsson, managing director of Bílageirinn, is a certified master aircraft mechanic. In aircraft maintenance there is no room for guesswork. Every dimension is measured, every step is recorded, and the job is not done until everything passes inspection. The same discipline applies on the floor in Grófin.',
    body:
      'Your car has one true line, the one it came with from the factory. Damage pushes it out of place. Our job is to find it again and hand the car back, measured and verified.',
    timeline: [
      { year: '2003', text: 'Bílageirinn is founded. The early years revolve around importing cars, motorcycles and parts.' },
      { year: '2004', text: 'A building is purchased for paintwork, which begins the same year. The workshop takes shape.' },
      { year: '2007', text: 'The company moves into a purpose-built 810 square meter facility at Grófin 14a.' },
    ],
  },
  services: [
    {
      name: 'Body repair',
      desc: 'Collision repairs of every size. The body is measured, straightened and checked until the line is back where it belongs.',
      tag: 'DAMAGE · CABAS',
    },
    {
      name: 'Paintwork',
      desc: 'Spraying and finishing in our own paint department, led by a dedicated foreman.',
      tag: 'IN-HOUSE',
    },
    {
      name: 'General repairs',
      desc: 'Maintenance and repairs that keep your car in shape between inspections.',
      tag: 'WORKSHOP',
    },
    {
      name: 'Oil and lube service',
      desc: 'Oil changes and lubrication. The Mobil lube station has its own phone line.',
      tag: 'TEL. 436 6901',
    },
    {
      name: 'Wheel alignment',
      desc: 'The wheel geometry is aligned so the car tracks straight and the tires wear evenly.',
      tag: 'ALIGNMENT',
    },
    {
      name: 'Headlight adjustment',
      desc: 'Headlights adjusted to light the road correctly, neither too high nor too low.',
      tag: 'ALIGNMENT',
    },
    {
      name: 'Brake and shock absorber testing',
      desc: 'The condition of brakes and shock absorbers checked and assessed.',
      tag: 'TESTING',
    },
  ],
  brands: {
    title: 'Authorized for Toyota and Kia',
    body:
      "Bílageirinn is an authorized service center for Toyota and Kia. For the owner this means maintenance is done to the manufacturer's specification and the car's service history keeps its value, both under warranty and at resale.",
    note: 'Other makes are of course just as welcome for general service.',
  },
  craft: {
    title: 'Craftsmanship that keeps up with the materials',
    body:
      'Materials in car painting and body repair change constantly. That is why the staff of Bílageirinn attend courses abroad once a year to keep up with the materials the workshop buys from its suppliers, and every course offered here in Iceland. The latest knowledge goes straight into the paint booth and onto the straightening bench.',
    points: ['Courses abroad once a year', 'Every course offered in Iceland', 'Dedicated paint-department foreman'],
  },
  claimSteps: [
    {
      title: 'Damage inspection',
      desc: 'You call or stop by in Grófin. We go over the damage with you.',
    },
    {
      title: 'CABAS assessment',
      desc: 'The damage is assessed in CABAS, the same system the insurance companies use. Paying yourself? You get a fixed quote.',
    },
    {
      title: 'The repair',
      desc: 'Straightening, painting and finishing, done to the assessment until the line is true.',
    },
    {
      title: 'A car while yours is in repair',
      desc: 'For an insured claim, Bílageirinn arranges a rental car for the duration of the repair, for those entitled to one under their insurer. We go over it with you in the first call.',
    },
  ],
  insurance: {
    title: 'No matter who insures you',
    body:
      'Bílageirinn works with every insurance company in Iceland, and the damage assessment is done in the same system the companies themselves use. You never have to pick a workshop based on your insurer.',
    companies: INSURANCE.companies,
  },
  team: [
    {
      name: 'Björn Steinar Unnarsson',
      role: 'Managing director',
      detail: 'Master aircraft mechanic',
    },
    { name: 'Ingibjörg Kristjánsdóttir', role: 'Office' },
    { name: 'Brynjar Sigurðsson', role: 'Paint department foreman' },
  ],
  facility: {
    title: 'Purpose-built around the work',
    body:
      'In 2007 Bílageirinn moved into an 810 square meter building at Grófin 14a, built from the ground up around the operation. Body repair, paint, lube service and general repairs are all under one roof.',
  },
  cta: {
    title: 'It starts with a phone call',
    body: 'You describe the damage or the errand, and we tell you exactly what happens next.',
  },
  facts: [
    { num: null, pad: 0, text: '2003', suffix: '', label: 'Founded in Reykjanesbær' },
    { num: 810, pad: 3, suffix: ' m²', label: 'Purpose-built facility in Grófin' },
    { num: null, pad: 0, text: 'Toyota · Kia', suffix: '', label: 'Authorized service' },
    { num: null, pad: 0, text: 'All', suffix: '', label: 'Icelandic insurance companies' },
  ],
  hours: [
    { days: 'Monday to Thursday', open: '08:00', close: '17:00' },
    { days: 'Friday', open: '08:00', close: '15:00' },
    { days: 'Saturday and Sunday', open: 'Closed', close: '' },
  ],
  trust: [
    'Since 2003',
    '810 m² at Grófin 14a',
    'Toyota and Kia authorized',
    'Member of Bílgreinasambandið',
    'CABAS damage assessment',
  ],
  ui: {
    slogan: 'As if it never happened.',
    heroKicker: 'Body repair · Paint · Car service · Grófin 14a, Reykjanesbær',
    heroKickerShort: 'Body repair · Paint · Grófin 14a',
    proofRow: [
      'Authorized service center for Toyota and Kia',
      'All insurance companies and CABAS assessment',
      'A car while yours is in repair',
    ],
    contactCta: 'Contact us',
    navServices: 'Services',
    navClaims: 'Collision repair',
    navWorkshop: 'The workshop',
    navTopAria: 'Bílageirinn, top of page',
    menuOpen: 'Open menu',
    menuClose: 'Close menu',
    servicesTitle: 'Everything for your car in one place',
    selfPayPre: 'Paying yourself? The damage is assessed in CABAS and you get a ',
    selfPayBold: 'fixed quote',
    selfPayPost: '.',
    lubeAnswers: 'The lube station answers directly at',
    claimsClose: 'It all starts with one phone call:',
    certLabel: 'Authorized',
    hoursLabel: 'Opening hours',
    locationLabel: 'Location',
    mapTitle: 'Find us in Grófin',
    footerOnPage: 'On this page',
    footerContact: 'Contact',
    footerCompany: 'Bílageirinn ehf · Reg. no. 460803-2410',
    footerLube: 'Lube station',
    mapIframeTitle: 'Bílageirinn location on a map',
    openMaps: 'Open in Google Maps',
    lubeLabel: 'Lube station:',
    hoursStrip: 'Mon–Thu 08:00–17:00 · Fri 08:00–15:00 · Closed on weekends',
    hoursShort: ['Mon–Thu', 'Fri', 'Sat–Sun'],
    formKicker: 'Rather write?',
    formTitle: 'Drop us a line',
    formIntro: 'For general inquiries. If the damage is new or urgent, calling is fastest.',
    fieldName: 'Name',
    fieldPhone: 'Phone',
    fieldPlate: 'Plate number',
    fieldService: 'Type of service',
    fieldMessage: 'More about the errand',
    optional: '(optional)',
    namePlaceholder: 'John Smith',
    phonePlaceholder: 'e.g. 555 5555',
    platePlaceholder: 'AB 123',
    messagePlaceholder: 'Tell us what happened or what you need…',
    selectPlaceholder: 'Choose a service',
    submit: 'Send message',
    sending: 'Sending…',
    sentNotice: 'Your email app is opening with the message ready. Press send there to finish.',
    recoveryQ: 'No email app opened?',
    copyMsg: 'Copy the message',
    copied: 'Copied',
    orCall: 'Or call',
    backToForm: 'Back to the form',
    formError: 'Fill in your name and phone number and choose a service.',
    mailSubject: 'Inquiry from the website',
    mailName: 'Name',
    mailPhone: 'Phone',
    mailPlate: 'Plate number',
    mailService: 'Type of service',
    mailNotProvided: '(not provided)',
    mailNoMessage: '(no further description)',
    specPlate: ['MEASURED', 'RECORDED', 'PASSES SPEC'],
    measurePoint: 'Measuring point',
    referenceLine: 'Reference line',
    paintAlt: 'Working on a car in the paint booth',
    polishAlt: 'Polishing the paint on a dark hood with a buffer',
    headlightAlt: 'Headlight on a dark car at night',
    garageAlt: 'Cars on lifts on a dark workshop floor',
    boothAlt: 'A car masked with paper and primed in a spray booth',
    reviewsTitle: 'What customers say',
    reviewsGoogle: '4.0 of 5 · 23 reviews on Google',
    reviewsSource: 'Verbatim reviews from Google and Facebook.',
    reviewsOpenGoogle: 'See all reviews on Google',
    reviewsTranslatedNote: 'translated review',
    readMore: 'Read more',
    readLess: 'Show less',
    reviews: [
      {
        name: 'Sandra Winbush',
        source: 'Google',
        quote: "Always get great service from them, can't recommend them more highly!",
        translated: true,
      },
      {
        name: 'Þorfinnur Kristinn Árnason',
        source: 'Google',
        quote: 'Top service at a reasonable price!',
        translated: true,
      },
      {
        name: 'Bjarney Kolbrún Garðarsdóttir',
        source: 'Facebook',
        quote:
          'I ran into trouble with my car on the way from Reykjavík to the airport when it suddenly broke down. I managed to drop off my flight passengers and was lucky to reach this workshop, and I have rarely met better service or a better attitude. They fixed the car and were very fair on the price too.',
        translated: true,
      },
      {
        name: 'Kjartan Árni',
        source: 'Google',
        quote: 'Top service, fast and friendly',
        translated: true,
      },
      {
        name: 'Lorena Vargas Ramos',
        source: 'Google',
        quote:
          'Excellent service, I made the appointment and they fix on time the windshield, they fix papers with insurance you don’t paid anything in the moment and later I’ll receive the invoice for my insurance company.',
      },
      {
        name: 'Atli Jóhannsson',
        source: 'Google',
        quote: 'Quality work practices',
        translated: true,
      },
      {
        name: 'Thorkell Halldorsson',
        source: 'Google',
        quote: 'Top service',
        translated: true,
      },
    ] as Review[],
    heroAlts: [
      'Sparks flying during metalwork in a dark workshop',
      'A car masked and primed in a spray booth',
      'Cars on lifts on a dark workshop floor',
    ],
    serviceAlts: [
      'A body panel protected and worked by hand',
      'Spray work in the paint booth',
      'Workshop floor with cars under repair',
      'Working underneath a car on a lift',
      'Suspension and wheel assembly up close',
      'Headlight on a dark car',
      'Brake assembly inspected with the wheel off',
    ],
  },
}

export const STRINGS: Record<Lang, typeof IS> = { is: IS, en: EN }
export type Strings = typeof IS
