import { CONTACT, EXTRAS, HOURS, PRODUCTS, RENTALS, UNITS, kr, openState, unitName, type Unit } from './data'

/*
 * The assistant on this page, wired ONLY to this page: our <sndr-chat> widget
 * with its `answerer` hook. Every question is matched against data.ts in the
 * browser, with no model and no network. It cannot say anything the page does
 * not say; anything else gets the designed refusal with the phone number.
 */

type Card = { title: string; rows: { k: string; v: string; total?: boolean }[]; cta?: { label: string; href: string } }
export type Answer = { reply?: string; tool?: string; card?: Card; refused?: boolean; chips?: string[] }
type Msg = { role: 'user' | 'assistant'; content: string }

export const GREETING = 'Halló! Ég svara um vagnana, leiguna, uppítöku, verkstæðið, verslunina og opnunartíma hjá Víkurverki. Hvað viltu vita?'
export const CHIPS = ['Hvað kostar að leigja hjólhýsi?', 'Hvenær er opið?', 'Léttasta hjólhýsið?', 'Get ég tekið vagninn minn upp í?']

const fold = (s: string) =>
  s.toLowerCase().replace(/ð/g, 'd').replace(/þ/g, 'th').replace(/æ/g, 'ae').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9/ .-]+/g, ' ').replace(/\s+/g, ' ').trim()
const has = (q: string, ...keys: (string | RegExp)[]) => keys.some((k) => (typeof k === 'string' ? q.includes(k) : k.test(q)))

const unitCard = (x: Unit): Answer => ({
  tool: 'fletti upp vagninum',
  reply: `${unitName(x)}: ${kr(x.price)}${x.cond === 'notad' ? ` (notaður, árgerð ${x.year})` : ''}.${x.sleeps ? ` Svefnpláss ${x.sleeps}.` : ''}${x.weight ? ` Eigin þyngd ${x.weight.toLocaleString('de-DE')} kg.` : ''}`,
  card: { title: unitName(x), rows: [...x.specs.slice(0, 4).map(([k, v]) => ({ k, v, total: false })), { k: 'Verð', v: kr(x.price), total: true }], cta: { label: 'Skoða vagninn', href: `vagnar/${x.slug}` } },
  chips: ['Bóka skoðun', 'Taka upp í'],
})
const refuse = (text?: string): Answer => ({
  refused: true,
  reply: text ?? `Ég svara bara út frá því sem stendur á þessari síðu, og þetta er ekki hér. Hringdu í ${CONTACT.phone} eða skrifaðu á ${CONTACT.email}.`,
  chips: ['Opnunartímar', 'Leiga', 'Vagnar á staðnum'],
})

export async function answer(messages: Msg[]): Promise<Answer> {
  const raw = messages.filter((x) => x.role === 'user').pop()?.content ?? ''
  const q = fold(raw)
  if (!q) return refuse()
  if (has(q, 'takk', 'thakka', 'snilld')) return { reply: `Ekkert mál. ${CONTACT.phone} ef þú vilt tala við manneskju.` }
  if (has(q, /^(hae|hallo|godan dag|saell|sael)\b/)) return { reply: 'Halló! Spurðu um vagn, leigu, verkstæðið eða opnunartíma.', chips: CHIPS }

  const unit = UNITS.find((x) => has(q, fold(x.model)) || has(q, fold(unitName(x))))
  if (unit) return unitCard(unit)

  if (has(q, 'leig', 'rent')) {
    return {
      tool: 'athugaði leiguverð',
      reply: 'Leigan er vikuleiga, frá fimmtudegi til miðvikudags. Sumarið 2027 er sýnt opið í dagatalinu hér; verðin eru verð sumarsins 2026.',
      card: { title: 'Vikuleiga', rows: RENTALS.map((r) => ({ k: r.name, v: `${kr(r.price)}${r.peak ? `, ${kr(r.peak)} um verslunarmannahelgi` : ''}` })).concat([{ k: EXTRAS.trygging.label, v: kr(EXTRAS.trygging.price) }]), cta: { label: 'Sjá lausar vikur', href: 'leiga' } },
    }
  }
  if (has(q, 'upp i', 'uppitak', 'gamla vagn', 'vagninn minn', 'verdmat', 'umbodssol', 'selja vagn'))
    return { reply: 'Já: sendu fastanúmerið og árgerðina á uppítökusíðunni og söluráðgjafi metur vagninn. Ég get sjálfur ekki metið verð.', card: { title: 'Uppítaka', rows: [{ k: 'Þarf', v: 'Fastanúmer, gerð, árgerð' }, { k: 'Svar frá', v: 'Söluráðgjafa' }], cta: { label: 'Senda vagninn', href: 'uppitaka' } } }
  if (has(q, 'lan', 'fjarmogn', 'ergo', 'greidsludreif'))
    return { reply: 'Víkurverk vísar á lánareiknivél Ergo. Kjörin sjálf eru ekki á þessari síðu; merktu við fjármögnun þegar þú bókar skoðun.', card: { title: 'Fjármögnun', rows: [{ k: 'Samstarfsaðili', v: 'Ergo' }], cta: { label: 'Bóka skoðun', href: 'skodun' } } }
  if (has(q, 'verkstaed', 'vidgerd', 'thjonustusko', 'lekasko', 'abyrgdarsko', 'vetrarstand', 'tjon'))
    return { reply: `${HOURS.workshop}. Bókaðu tíma með fastanúmeri vagnsins; tjónaviðgerðir þurfa tjónsnúmer frá tryggingafélagi. Verkstæðið tekur ekki við fellihýsum.`, card: { title: 'Verkstæði', rows: [{ k: 'Netfang', v: CONTACT.workshop }, { k: 'Sími', v: CONTACT.phone }], cta: { label: 'Bóka verkstæði', href: 'verkstaedi' } } }
  if (has(q, 'opid', 'opnunart', 'opnar', 'lokad', 'hvenaer er')) {
    const s = openState()
    return { tool: 'athugaði opnunartíma', reply: `Verslun: ${HOURS.shopWinter}. ${HOURS.shopSummer}. ${HOURS.workshop}.`, card: { title: 'Víkurhvarf 6 núna', rows: [{ k: 'Miðað við opnunartíma', v: s.text }] } }
  }
  if (has(q, 'hvar', 'heimilisf', 'kopavog', 'vikurhvarf')) return { reply: `${CONTACT.street}, ${CONTACT.town}. Verkstæðismóttakan er austan megin við húsið.` }
  if (has(q, 'lett', 'laegst', 'draga', 'rafbil')) {
    const light = [...UNITS].filter((x) => x.weight && x.kind !== 'husbill').sort((a, b) => a.weight! - b.weight!).slice(0, 3)
    return { reply: 'Léttustu vagnarnir í úrtakinu, eftir eigin þyngd:', card: { title: 'Léttast fyrst', rows: light.map((x) => ({ k: unitName(x), v: `${x.weight} kg` })), cta: { label: 'Sía eftir þyngd', href: 'vagnar?thyngd=750' } } }
  }
  if (has(q, 'notad', 'notud')) {
    const used = UNITS.filter((x) => x.cond === 'notad')
    return { reply: 'Notaðir vagnar í úrtakinu (24 á söluskránni):', card: { title: 'Notaðir', rows: used.map((x) => ({ k: `${unitName(x)} ${x.year}`, v: kr(x.price) })), cta: { label: 'Allir notaðir', href: 'vagnar?astand=notad' } } }
  }
  if (has(q, 'husbil', 'randger', 'benimar')) return unitCard(UNITS.find((x) => x.kind === 'husbill')!)
  if (has(q, 'mink', 'sporthys')) return unitCard(UNITS.find((x) => x.slug === 'mink-s')!)
  if (has(q, 'tjaldvagn', 'camp-let', 'camplet')) return unitCard(UNITS.find((x) => x.kind === 'tjaldvagn')!)
  if (has(q, 'sendin', 'heimsend', 'postur')) return { reply: 'Frí heimsending á öllum pöntunum yfir 20.000 kr., eins og stendur á vef Víkurverks.' }
  if (has(q, 'grill', 'fortjald', 'stol', 'kaelibox', 'hitari', 'verslun', 'aukahlut')) {
    const hit = PRODUCTS.filter((p) => has(fold(p.name), ...q.split(' ').filter((w) => w.length > 3))).slice(0, 4)
    return { reply: hit.length ? 'Úr versluninni:' : 'Verslunin er með 1.635 vörur; hér eru 14 sýndar.', card: hit.length ? { title: 'Verslun', rows: hit.map((p) => ({ k: p.name, v: kr(p.price) })), cta: { label: 'Í verslun', href: 'verslun' } } : undefined }
  }
  if (has(q, 'hjolhys', 'vagn', 'kostar', 'verd')) return { reply: 'Hvers konar vagn?', chips: ['Hjólhýsi', 'Húsbíll', 'Mink', 'Notaðir'] }
  if (has(q, 'simi', 'sima', 'hringja', 'netfang', 'email')) return { reply: `Sími ${CONTACT.phone}, ${CONTACT.email}. Verkstæði: ${CONTACT.workshop}. Varahlutir: ${CONTACT.parts}.` }
  return refuse()
}
