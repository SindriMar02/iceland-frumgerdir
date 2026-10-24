/**
 * BRUGGSMIÐJAN KALDI — bruggsmidjan.is (kt. 521205-1520), Öldugata 22, 621 Árskógssandur
 *
 * Every fact about a beer below is Kaldi's own: the text of their beer page
 * (bruggsmidjan.is/bjorarnir, re-read 2026-10-24, page title still "Services 1"),
 * their front page and the labels on their own product photographs. Norðan Kaldi and
 * Kaldi Neipa were on that page in August 2026 and are gone now, so they are not here.
 * No prices: the site is a product information page (áfengislög 75/1998, gr. 20), and
 * the only prices Kaldi publishes are the kynning (3.500 kr. á mann).
 *
 * Photography: their own product photographs (1620 px PNG with alpha on their
 * Squarespace), trimmed and served as WebP. No generated imagery.
 */

export const BASE = import.meta.env.BASE_URL

export type Lina = 'lager' | 'ol' | 'jol' | 'afengislaust'
export type Umbudir = 'flaska' | 'dos'

export interface Product {
  slug: string
  name: { is: string }
  /** one line, their words */
  desc: { is: string }
  /** the longer text from their beer page */
  lysing: string
  stil: string
  /** as published by Kaldi (beer page or label); absent = not published */
  abv?: string
  abvHeimild?: 'vefur' | 'midi'
  umbudir: Umbudir
  lina: Lina
  /** the label colour: the ground the bottle stands on */
  tint: string
  malt?: string
  humlar?: string
  ger?: string
  gerjun?: string
  merki?: string[]
}

const P = (p: Product): Product => p

export const PRODUCTS: Product[] = [
  P({ slug: 'ljos', name: { is: 'Kaldi Ljós' }, stil: 'Lager, bruggaður eftir Pilsner hefðinni', abv: '5%', abvHeimild: 'vefur', umbudir: 'flaska', lina: 'lager', tint: '#E9B49A',
    desc: { is: 'Fyrsti bjórinn frá Kalda og einn söluhæsti flöskubjórinn á Íslandi.' },
    lysing: 'Kaldi Ljós er fyrsti bjórinn sem Bruggsmiðjan Kaldi kom með á markað, og er einnig einn söluhæsti flöskubjórinn á Íslandi. Kaldi Ljós er lager bjór, en er bruggaður eftir Pilsner hefðinni, svo hann flokkast sem slíkur.',
    malt: 'Pilsen (Pilsner) og Caramel', humlar: 'Humlaþykkni, Sladek og Saaz', gerjun: '4 vikur', merki: ['Fyrsti bjórinn'] }),
  P({ slug: 'dokkur', name: { is: 'Kaldi Dökkur' }, stil: 'Dökkur Pilsner', abv: '5%', abvHeimild: 'vefur', umbudir: 'flaska', lina: 'lager', tint: '#DDBF8C',
    desc: { is: 'Rafbrúnn á lit með mikilli fyllingu, ristuðu malti og karamellukeim.' },
    lysing: 'Kaldi Dökkur er annar bjórinn sem Bruggsmiðjan setti á markað. Þessi dökki Pilsner er rafbrúnn á lit með mikilli fyllingu, ristuðu malti og karamellukeim. Kaldi Dökkur á sér afar tryggan kúnnahóp sem stækkar meir og meir.',
    malt: 'Pilsen, Munich, Caramel og Colour', humlar: 'Humlaþykkni, Sladek og Saaz', gerjun: '4 vikur', merki: ['Annar bjórinn'] }),
  P({ slug: 'lite', name: { is: 'Kaldi Lite' }, stil: 'Léttur lager, kolvetnaskertur', abv: '4,4%', abvHeimild: 'vefur', umbudir: 'dos', lina: 'lager', tint: '#B9D3E2',
    desc: { is: 'Ljósgullinn. Ósætur, léttur, hverfandi beiskja.' },
    lysing: 'Kaldi Lite er 4,4% og því léttur og ljúfur. Hann er ekki bara léttur á bragðið heldur er hann jafnframt kolvetnaskertur og því færri hitaeiningar en í hefðbundnum bjór. Ljósgullinn. Ósætur, léttur, hverfandi beiskja.',
    malt: 'Pilsen og Caramel', humlar: 'Humlaþykkni, Sladek og Saaz', gerjun: '4 vikur' }),
  P({ slug: 'nullprosent', name: { is: 'Áfengislaus Kaldi' }, stil: 'Áfengislaus', abv: '0,0%', abvHeimild: 'midi', umbudir: 'dos', lina: 'afengislaust', tint: '#AFC1E2',
    desc: { is: 'Fyrsta áfengislausa varan frá Kalda, á markað í júní 2023.' },
    lysing: 'Áfengislaus Kaldi kom á markað í júní 2023 og er fyrsta áfengislausa varan frá Kalda. Útkoman er bragðmikill og góður óáfengur kostur.',
    merki: ['Frá júní 2023'] }),
  P({ slug: 'ipa', name: { is: 'Kaldi IPA' }, stil: 'India Pale Ale að bandarískri fyrirmynd', abv: '6,0%', abvHeimild: 'midi', umbudir: 'flaska', lina: 'ol', tint: '#A6D2DE',
    desc: { is: 'Simcoe, Citra og Mosaic: öflug beiskja og keimur af suðrænum ávöxtum.' },
    lysing: 'Kaldi IPA er India Pale Ale af bandarískri fyrirmynd. Bandaríska US-05 gerið gefur bjórnum tæra og þurra fyllingu. Amerísku humlarnir Simcoe, Citra og Mosaic gefa öfluga beiskju og sterkan keim af suðrænum ávöxtum sem skilar sér einnig vel út í lyktina.',
    humlar: 'Simcoe, Citra og Mosaic', ger: 'US-05' }),
  P({ slug: 'tripel', name: { is: 'Kaldi Tripel' }, stil: 'Belgískt öl', abv: '9,3%', abvHeimild: 'vefur', umbudir: 'flaska', lina: 'ol', tint: '#EBD392',
    desc: { is: 'Belgískt Abbey ger, dökkur koparlitur og kandís upp í 9,3%.' },
    lysing: 'Kaldi Tripel er belgískt öl bruggað með belgísku Abbey geri á háu hitastigi sem gefur mikinn og flókinn keim af ávöxtum og smá kryddi. Caramel bygg gefur bjórnum dökkan koparlit, bragð af dökkri karamellu og öfluga fyllingu. Til að ná vínandanum upp í heil 9,3% er bætt við kandís.',
    malt: 'Tékkneskt bygg, meðal annars Caramel', ger: 'Belgískt Abbey ger', merki: ['Kandís'] }),
  P({ slug: 'jola', name: { is: 'Jóla Kaldi' }, stil: 'Jólabjór', abv: '5,4%', abvHeimild: 'vefur', umbudir: 'flaska', lina: 'jol', tint: '#E49C90',
    desc: { is: 'Hefur oft verið valinn besti jólabjórinn á Íslandi.' },
    lysing: 'Jóla Kaldi er löngu orðinn stór hluti af jólahefðinni hjá íslenskum bjórunnendum. Bruggararnir leggja sig alla fram við að gera hann sem bestan. Jóla Kaldi hefur oft verið valinn besti jólabjórinn á Íslandi og hann hefur jafnvel selst upp áður en síðasti jólasveinninn kemur til byggða.',
    malt: 'Pilsen, Munich og Caramel', humlar: 'Humlaþykkni og Saaz', gerjun: '4 vikur', merki: ['Jólin'] }),
  P({ slug: 'porter', name: { is: 'Jóla Súkkulaði Porter' }, stil: 'Undirgerjaður porter', umbudir: 'flaska', lina: 'jol', tint: '#DCC6AA',
    desc: { is: 'Nóa Síríus súkkulaði og kakó á móti tékkneskum Saaz humlum.' },
    lysing: 'Undirgerjaður porter með tékkneska lagergerinu. Dökkt og ristað bygg gefur dökkan lit og ristað eftirbragð. Sæt og mjúk fylling. Í humlasuðu er bætt við Nóa Síríus súkkulaði og kakódufti, og tékkneskir Saaz humlar gefa jarðbundna beiskju á móti sætunni.',
    malt: 'Dökkt og ristað bygg', humlar: 'Saaz', ger: 'Tékkneskt lagerger', merki: ['Jólin', 'Súkkulaði'] }),
]

export const productBySlug = (slug: string) => PRODUCTS.find((p) => p.slug === slug)

export const LINU_NAFN: Record<Lina, string> = { lager: 'Lager', ol: 'Öl', jol: 'Jólabjór', afengislaust: 'Áfengislaust' }

export const CONTACT = {
  name: 'Bruggsmiðjan Kaldi',
  email: 'bruggsmidjan@bruggsmidjan.is',
  emailSermerking: 'joi@bruggsmidjan.is',
  phone: '466 2505',
  phoneHref: 'tel:+3544662505',
  address: 'Öldugata 22',
  postcode: '621 Árskógssandur',
  kt: '521205-1520',
  mapHref: 'https://www.google.com/maps/search/?api=1&query=%C3%96ldugata+22+621+%C3%81rsk%C3%B3gssandur',
  hotel: 'https://hotelkaldi.is',
  bjorbod: 'https://www.bjorbodin.is',
  facebook: 'https://www.facebook.com/Kaldibrugg',
  instagram: 'https://www.instagram.com/kaldibrugg/',
}

/** a beer's cutout in one of its three sizes (s 560 px tall, m 1000 px, b = full file) */
export const PK = (slug: string, _kind: 'pack' = 'pack', size: 's' | 'm' | 'b' = 'm') =>
  `${BASE}kaldi/p/${slug}/pack${size === 'b' ? '' : `-${size}`}.webp`

export const MYND = (n: string) => `${BASE}kaldi/img/${n}.webp`
