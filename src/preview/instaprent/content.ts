/* Front page and shared copy. Her own words and facts from iprent.is
   (um-okkur, skilmálar, staðsetning, hafa-samband), shortened, no invented claims. */

/* Year-round hero in her own words: the headline is her site title on iprent.is,
   the slogan is the opening line of her print descriptions. */
export const HERO = {
  title: ['Persónuleg gjöf', 'sem gleður'],
  slogan: 'Hleyptu myndunum þínum í dagsljósið.',
  primary: { label: 'Skoða gjafir', to: 'flokkur/thin-honnun' },
  secondary: { label: 'Framköllun', to: 'flokkur/framkollun' },
}

export const INTERTEXT = {
  text: 'Bollar, púðar, púsl og myndir með þinni mynd og þínum texta. Allt prentað hjá okkur í Mosfellsbæ.',
  link: 'Sjáðu hvernig þetta virkar',
}

export const TILES: { cat: string; img: string; color: string }[] = [
  { cat: 'framkollun', img: 'p-instagram-myndir-1010-1', color: 'var(--blue)' },
  { cat: 'thin-honnun', img: 'p-pusluspil-ur-vid-1', color: 'var(--orange)' },
  { cat: 'okkar-honnun', img: 'p-seglar-lifsspeki-1', color: 'var(--pink)' },
  /* the giraffe art carries her watermark across the middle, right where the title sits */
  { cat: 'barnaherbergid', img: 'p-bangsi-i-peysu-med-nafni-eda-mynd-1', color: 'var(--orange)' },
]

export const STEPS = [
  { t: 'Veldu vöru', p: 'Bolli, púði, púsl, myndir á pappír eða gjöf úr okkar hönnun.' },
  { t: 'Settu inn mynd og texta', p: 'Þú hleður myndinni upp á vörusíðunni og skrifar textann. Enginn tölvupóstur.' },
  { t: 'Sæktu eða fáðu sent', p: 'Tilbúið á 5 til 7 virkum dögum. Sótt í Háholt 14 eða sent með Póstinum.' },
]

export const FAQ = [
  {
    q: 'Hvernig sendi ég ykkur myndina?',
    a: 'Þú hleður henni upp á vörusíðunni um leið og þú pantar. Myndin og textinn fylgja pöntuninni beint til okkar.',
  },
  {
    q: 'Hvað tekur langan tíma að fá vöruna?',
    a: 'Það tekur venjulega 5 til 7 virka daga. Á álagstímum eins og fyrir jól getur það tekið ögn lengri tíma, svo við mælum með að panta gjafir tímanlega.',
  },
  {
    q: 'Get ég sótt pöntunina sjálf?',
    a: 'Já, í verslun okkar og verkstæði í Háholti 14, Mosfellsbæ. Opið virka daga 12–17 og laugardaga 12–15.',
  },
  {
    q: 'Fæ ég að sjá hönnunina áður en hún er prentuð?',
    a: 'Eftir pöntun færð þú tölvupóst frá okkur varðandi hönnunina á vörunni þinni.',
  },
  {
    q: 'Hvernig get ég greitt?',
    a: 'Með korti á netinu, með millifærslu, eða þegar þú sækir í verslunina.',
  },
]

export const ASSURE = ['Prentað í Mosfellsbæ', 'Sótt í Háholt 14 eða sent', 'Tilbúið á 5–7 virkum dögum', 'Myndin fylgir pöntuninni']

export const ABOUT = [
  'Instaprent.is er netverslun sem býður upp á mikið úrval af sérsniðnum vörum. Áhersla okkar er að búa til vandaðar og fallegar vörur sem hægt er að njóta hvar sem er.',
  'Instaprent.is framleiðir ýmsar vörur með mynd frá þér. Allt frá tilbúinni vöru til sérsniðinna vara með þinni mynd og þínum texta.',
  'Við hjá Instaprent erum staðsett í Mosfellsbæ þar sem þú getur sótt vörurnar þínar. Þú getur heimsótt verslun okkar og verkstæði í Háholti 14 á opnunartíma.',
]
