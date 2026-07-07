/**
 * Rakarastofa Björns og Kjartans (Austurvegur 4, Selfoss) — verified content only.
 * See BRIEF.md in this folder for sources. Everything factual below is from their
 * own live site / Noona; PRICES and any review lines are SÝNISHORN (samples),
 * labelled on-page + in the shared footer.
 */

export const NOONA = 'https://noona.app/rakarastofabk'
export const PHONE_DISPLAY = '482 2244'
export const PHONE_HREF = 'tel:+3544822244'
export const EMAIL = 'rakarastofa@gmail.com'
export const MAPS = 'https://maps.google.com/?q=Rakarastofa+Björns+og+Kjartans,+Austurvegur+4,+800+Selfoss'
export const FACEBOOK = 'https://www.facebook.com/Rakarastofa-Bj%C3%B6rns-Og-Kjartans-1225494727464491/'

const ASSET = `${import.meta.env.BASE_URL}rakarastofa/`
/** ONE generated hero image — a neon "Barber Shop" sign, generated on pure black
 *  in the Higgsfield web app (0 credits) and screen-blended onto the page so the
 *  site's own charcoal is the exact background. See IMAGE-PROMPTS.md.
 *  heritage-1948.jpg is the REAL vintage photo (already in the repo). */
export const IMG = {
  hero: `${ASSET}hero.jpg`, // the neon Barber Shop sign, isolated on black (screen-blended)
  heritage: `${ASSET}heritage-1948.jpg`, // the REAL vintage B&W photo from their own site
}

/** Founded 1948 by Gísli Sigurðsson (from their own site). */
export const FOUNDED = 1948
export const FOUNDER = 'Gísli Sigurðsson'

/** The barbers, named on their own site. Owners flagged. */
export const BARBERS = [
  { name: 'Björn Ingi Gíslason', role: 'Eigandi og rakari', owner: true },
  { name: 'Kjartan Björnsson', role: 'Eigandi og rakari', owner: true },
  { name: 'Björn Daði Björnsson', role: 'Eigandi og rakari', owner: true },
  { name: 'Guðrún Þórhallsdóttir', role: 'Rakari', owner: false },
  { name: 'Mó', role: 'Rakari', owner: false },
  { name: 'Fannar Aron Hafsteinsson', role: 'Rakari', owner: false },
]

/** Verðskrá — SÝNISHORN. Confirm real prices with the shop before sending. */
export interface Service {
  name: string
  note: string
  price: string
}
export const SERVICES: Service[] = [
  { name: 'Klipping', note: 'Herraklipping, þvottur og frágangur', price: '6.900 kr.' },
  { name: 'Klipping og skegg', note: 'Klipping með skeggsnyrtingu', price: '9.400 kr.' },
  { name: 'Skeggsnyrting', note: 'Snyrting og lögun á skeggi', price: '3.900 kr.' },
  { name: 'Barnaklipping', note: '12 ára og yngri', price: '4.900 kr.' },
  { name: 'Eldri borgarar', note: 'Klipping á rólegri stund', price: '5.400 kr.' },
  { name: 'Snoðklipping', note: 'Ein lengd, hratt og hreint', price: '4.400 kr.' },
]

/** Opening hours, exactly as published on their site. */
export const HOURS = [
  { day: 'Mánudaga til föstudaga', time: '9:00 – 17:00' },
  { day: 'Laugardaga', time: '9:30 – 12:00' },
  { day: 'Sunnudaga', time: 'Lokað' },
]

export const FACTS = [
  { big: '1948', small: 'Klippt á Selfossi síðan' },
  { big: '6', small: 'Rakarar á stofunni' },
  { big: 'Austurvegur 4', small: 'Í hjarta Selfoss' },
]

export const STORY = {
  headline: 'Sama stofan síðan 1948',
  body:
    'Gísli Sigurðsson opnaði rakarastofuna á Selfossi árið 1948. Síðan þá hefur verið klippt hér nánast óslitið, kynslóð fram af kynslóð, og í dag standa Björn Ingi, Kjartan og Björn Daði vaktina ásamt góðu teymi. Sömu handtökin, sama stofan, sömu rólegheitin.',
  caption: 'Úr safni stofunnar. Klipping á Selfossi um miðja síðustu öld.',
}

export const ADDRESS = { street: 'Austurvegur 4', town: '800 Selfoss', region: 'Suðurland' }

/** Hero line + supporting copy. */
export const HERO = {
  eyebrow: 'Rakarastofa · Selfoss · síðan 1948',
  line1: 'Klippt',
  line2: 'síðan 1948',
  sub: 'Rótgróin rakarastofa í hjarta Selfoss. Herraklipping, skegg og gamla góða rakarastofustemningin. Bókaðu tíma eða líttu við.',
}
