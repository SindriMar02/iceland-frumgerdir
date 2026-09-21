import { GRUNNAR } from './data'

/* Góa's own catalogue, read off goa.is (getProducts.php) on 2026-09-21.
   nr = their vörunúmer, pk = their pakkning string, pdf = their ingredient
   sheet. Góa publishes no prices, so none are shown. */
export type Vara = { nr: string; n: string; pk: string; img: string; pdf?: string; grunnur: string; s?: number }

const U = (f: string) => 'https://goa.is/uploads/' + encodeURIComponent(f)

export const HILLAN: Vara[] = [
  { nr: '11101', n: 'Hraun', pk: '30 g × 24 stk.', img: '/goa/hraun.webp', pdf: U('hraun-bitar-vorulysing.pdf'), grunnur: GRUNNAR.hraun },
  { nr: '11105', n: 'Risahraun', pk: '55 g × 20 stk.', img: '/goa/risahraun.webp', pdf: U('hraun-bitar-vorulysing_(2).pdf'), grunnur: GRUNNAR.florida },
  { nr: '11245', n: 'Floridabitar', pk: '200 g × 12 stk.', img: '/goa/floridabitar.webp', pdf: U('Innihaldslýsing Florida.pdf'), grunnur: GRUNNAR.karamella },
  { nr: '11625', n: 'Appolo lakkrís molar', pk: '150 g × 24 stk.', img: '/goa/appolo-hjup.webp', pdf: U('Innihaldslýsing súkkulaðihúðaður svartur lakkrís .pdf'), grunnur: GRUNNAR.egg },
  { nr: '11326', n: 'Bingókúlur', pk: '150 g × 24 stk.', img: '/goa/bingokulur.webp', pdf: U('Innihaldslýsing Bingo-lakkrískúlur_(2).pdf'), grunnur: GRUNNAR.bingo },
  { nr: '11729', n: 'Fílakúlur', pk: '550 g × 16 stk.', img: '/goa/filakulur.webp', pdf: U('Innihaldslýsingar Fílakúlur_(3).pdf'), grunnur: GRUNNAR.gull },
  { nr: '11171', n: 'Brak', pk: '150 g × 20 stk.', img: '/goa/brak.webp', pdf: U('Innihaldslýsing Brak_(1).pdf'), grunnur: GRUNNAR.brak },
  { nr: '11555', n: 'Karamellur', pk: '150 g × 16 stk.', img: '/goa/karamellur.webp', pdf: U('2016-09-14-karamellur-og-toffisleikjo_(8).pdf'), grunnur: GRUNNAR.karamella },
  { nr: '11032', n: 'Bangsahlaup', pk: '150 g × 24 stk.', img: '/goa/bangsahlaup.webp', pdf: U('Innihaldslýsingar  Góu Snuddu og bangsahlaup_(7).pdf'), grunnur: GRUNNAR.bangsi },
  { nr: '10121', n: 'Appolo fylltar reimar', pk: '80 g × 28 stk.', img: '/goa/appolo-fylltar-reimar.webp', pdf: U('Innihaldslysing-Fylltur-lakkris_(3).pdf'), grunnur: GRUNNAR.pipar },
  { nr: '10220', n: 'Appolo lakkrískurl', pk: '150 g × 28 stk.', img: '/goa/appolo-kurl.webp', pdf: U('innihaldlýsing appolo-lakkris svartur_(7).pdf'), grunnur: GRUNNAR.hjup },
  { nr: '121315', n: 'Lindor hvítt súkkulaði', pk: '100 g × 24 stk.', img: '/goa/lindor.webp', pdf: U('Innihaldslýsing hvítt súkkulaði_(3).pdf'), grunnur: GRUNNAR.linda },
]

/* s = drawn size. The eggs scale with the cube root of their weight (volume
   goes with the cube of height), so nr. 3 stands visibly shorter than nr. 11
   the way it does on a shop shelf. */
export const EGGIN: Vara[] = [
  { s: 0.52, nr: '11830', n: 'Góu egg nr. 3', pk: '155 g', img: '/goa/paskaegg-3.webp', grunnur: GRUNNAR.egg },
  { s: 0.66, nr: '11831', n: 'Góu egg nr. 4', pk: '325 g', img: '/goa/paskaegg-4.webp', grunnur: GRUNNAR.egg },
  { s: 0.74, nr: '11832', n: 'Góu egg nr. 5', pk: '450 g', img: '/goa/paskaegg-5.webp', grunnur: GRUNNAR.egg },
  { s: 0.84, nr: '11834', n: 'Góu egg nr. 7', pk: '650 g', img: '/goa/paskaegg-7.webp', grunnur: GRUNNAR.egg },
  { s: 1.0, nr: '11836', n: 'Risaegg nr. 11', pk: '1,111 kg', img: '/goa/paskaegg-11.webp', grunnur: GRUNNAR.egg },
  { s: 0.74, nr: '11846', n: 'Hraunegg nr. 5', pk: '450 g', img: '/goa/paskaegg-hraun-5.webp', grunnur: GRUNNAR.hraun },
  { s: 0.74, nr: '11840', n: 'Lakkrísegg nr. 5', pk: '450 g', img: '/goa/paskaegg-appolo-5.webp', grunnur: GRUNNAR.bingo },
  { s: 0.66, nr: '11848', n: 'Lindor hvítt súkkulaðiegg', pk: '325 g', img: '/goa/paskaegg-lindor-4.webp', grunnur: GRUNNAR.gull },
]

/* Category counts are the listing counts on goa.is, 2026-09-21. */
export const FJOLDI = { goa: 71, linda: 20, appolo: 32, lausu: 40 }
