/* Brimborg, 31.10.2026. The assistant is a design only: the widget, its greeting and
 * its chips are the real component, and every question gets the same line. No network,
 * no generated facts. Same system as Íslyft and ÍSBAND (Benni's page-only chat).
 */
type Card = { title: string; rows: { k: string; v: string; total?: boolean }[]; cta?: { label: string; href: string } }
export type Answer = { reply?: string; tool?: string; card?: Card; refused?: boolean; chips?: string[] }
type Msg = { role: 'user' | 'assistant'; content: string }
export const GREETING = 'Halló! Ég get svarað um Polestar 5, verð, bíla á lager, reynsluakstur og opnunartíma Brimborgar. Hvað viltu vita?'
export const CHIPS = ['Hvað kostar Polestar 5?', 'Hvenær er opið?', 'Reynsluakstur', 'Rafbílastyrkur']
export function answer(history: Msg[]): Answer {
  /* Prototype: the assistant is a design only, every question gets this line. */
  void history
  return { reply: 'Þú þarft að kaupa vefsíðuna af Sindra fyrir svarið.' }
}
