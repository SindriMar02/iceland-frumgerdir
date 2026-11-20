/**
 * Christmas products: the built-in list, from Þorleifur's email of 16 Nov 2026
 * ("Jólavörur", prices as he wrote them). The Christmas page reads the Studio's
 * Jólavörur first; this list is only what the page shows until he has his own
 * products there (and the content the seed script puts there for him).
 */
import type { Bilingual } from './order'

export type JolGroupId = 'lagtertur' | 'kokur' | 'smakokur' | 'annad'
export interface JolProduct {
  group: JolGroupId
  name: Bilingual
  desc?: Bilingual
  price?: string
  img?: { src: string; srcSm: string; alt: Bilingual }
}

export const JOL_GROUPS: { id: JolGroupId; title: Bilingual; kicker: Bilingual }[] = [
  { id: 'lagtertur', title: { is: 'Lagtertur', en: 'Layer cakes' }, kicker: { is: 'Jólaklassíkin', en: 'The Christmas classic' } },
  { id: 'kokur', title: { is: 'Jólakakan', en: 'The Christmas cake' }, kicker: { is: 'Ensk ávaxtakaka', en: 'English fruit cake' } },
  { id: 'smakokur', title: { is: 'Smákökur', en: 'Christmas cookies' }, kicker: { is: 'Sjö sortir', en: 'Seven kinds' } },
  { id: 'annad', title: { is: 'Butterdeigsbotnar', en: 'Puff pastry bases' }, kicker: { is: 'Fyrir veisluna', en: 'For the table' } },
]

const B = `${import.meta.env.BASE_URL}reynir/jol/vorur/`
const pic = (slug: string, is: string, en: string) => ({ src: `${B}${slug}.webp`, srcSm: `${B}${slug}-600.webp`, alt: { is, en } })

export const JOL_FALLBACK: JolProduct[] = [
  { group: 'lagtertur', name: { is: 'Lagterta hrærð með kremi', en: 'Layer cake with cream' }, price: '2.470 kr.' },
  { group: 'lagtertur', name: { is: 'Lagterta hnoðuð með kremi og sveskjusultu', en: 'Kneaded layer cake with cream and prune jam' }, price: '2.470 kr.', img: pic('lagterta-hnodud', 'Hnoðuð lagterta með kremi og sveskjusultu, skorin', 'Kneaded layer cake with cream and prune jam, cut') },
  { group: 'lagtertur', name: { is: 'Karamellulagterta með kremi', en: 'Caramel layer cake with cream' }, price: '2.470 kr.', img: pic('lagterta', 'Karamellulagterta með kremi, sneidd, við jólakúlur', 'Caramel layer cake with cream, sliced, beside Christmas baubles') },
  { group: 'lagtertur', name: { is: 'Hvít lagterta með rabarbarasultu', en: 'White layer cake with rhubarb jam' }, price: '2.470 kr.', img: pic('lagterta-hvit', 'Hvít hnoðuð lagterta með rabarbarasultu', 'White kneaded layer cake with rhubarb jam') },
  { group: 'lagtertur', name: { is: 'Hálf lagterta', en: 'Half layer cake' }, price: '1.350 kr.' },
  { group: 'kokur', name: { is: 'Ensk ávaxtakaka', en: 'English fruit cake' }, price: '2.550 kr.', img: pic('jolakaka', 'Ensk ávaxtakaka, skorin í sneiðar', 'English fruit cake, cut into slices') },
  { group: 'smakokur', name: { is: 'Vanilluhringir', en: 'Vanilla rings' }, price: '999 kr.', img: pic('vanilluhringir', 'Vanilluhringir á bökunarpappír', 'Vanilla rings on baking paper') },
  { group: 'smakokur', name: { is: 'Mömmukökur', en: 'Mömmukökur' }, price: '999 kr.', img: pic('mommukokur', 'Mömmukökur á bökunarplötu', 'Mömmukökur on a baking sheet') },
  { group: 'smakokur', name: { is: 'Lakkrístoppar', en: 'Liquorice meringues' }, price: '999 kr.', img: pic('lakkristoppar', 'Lakkrístoppar í bökunarformum', 'Liquorice meringues in paper cases') },
  { group: 'smakokur', name: { is: 'Piparkökur', en: 'Gingerbread cookies' }, price: '999 kr.' },
  { group: 'smakokur', name: { is: 'Spesíur', en: 'Spesíur butter cookies' }, price: '999 kr.' },
  { group: 'smakokur', name: { is: 'Kókosspesíur', en: 'Coconut spesíur' }, price: '999 kr.', img: pic('kokosspesiur', 'Kókosspesíur á bökunarplötu', 'Coconut spesíur on a baking sheet') },
  { group: 'smakokur', name: { is: 'Súkkulaðibitakökur', en: 'Chocolate chip cookies' }, price: '999 kr.', img: pic('sukkuladibitakokur', 'Súkkulaðibitakökur á bökunarplötu', 'Chocolate chip cookies on a baking sheet') },
  { group: 'annad', name: { is: 'Butterdeigsbotn', en: 'Puff pastry base' }, price: '1.750 kr.', img: pic('butterdeig', 'Butterdeigsbotnar', 'Puff pastry bases') },
]
