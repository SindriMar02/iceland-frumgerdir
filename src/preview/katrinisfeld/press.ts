/**
 * Í fjölmiðlum — the clippings she keeps.
 *
 * Her own page is a heading, one sentence and twelve photographs of magazine
 * spreads. The value of it is entirely in text that a search engine and an
 * assistant can read, and on her site every word of it is locked inside a
 * JPEG. So each clipping carries its headline as real text here.
 *
 * OUTLETS ARE ONLY NAMED WHERE THE CLIPPING PROVES IT. Two do: one carries a
 * Morgunblaðið masthead with a date, another an mbl.is byline. She names Hús
 * og hýbýli herself. Everything else is left as an untitled clipping rather
 * than guessed at — a wrong publication is worse than none, and it is the
 * kind of error nobody catches for years.
 */
export interface Clipping {
  id: string
  /** The headline as printed. */
  headline: string
  /** Only where the clipping itself carries it. */
  outlet?: string
  /** Only where the clipping itself carries it. */
  date?: string
  /** The same date, machine-readable, for datePublished. */
  isoDate?: string
  /** Byline, where printed. */
  byline?: string
  alt: string
}

export const PRESS_LEAD =
  'Viðtöl við Katrínu sem hafa birst á prenti, og verkefni hennar eins og þau hafa komið fyrir í Húsum og híbýlum og Morgunblaðinu.'

export const PRESS: ReadonlyArray<Clipping> = [
  {
    id: 'press-0',
    headline: 'Mikill misskilningur að lítil rými þurfi eingöngu að vera í ljósum litum',
    alt: 'Opna úr tímariti með fyrirsögninni „Mikill misskilningur að lítil rými þurfi eingöngu að vera í ljósum litum“ og mynd af Katrínu við hillu',
  },
  {
    id: 'press-1',
    headline: 'Rómantískur rokkari',
    outlet: 'Morgunblaðið',
    date: '8. maí 2016',
    isoDate: '2016-05-08',
    alt: 'Hönnunaropna Morgunblaðsins með fyrirsögninni „Rómantískur rokkari“ og myndum úr verkefnum Katrínar',
  },
  {
    id: 'press-2',
    headline: 'Djúpir litir koma sterkir inn',
    outlet: 'Morgunblaðið',
    byline: 'Sigurborg Selma Karlsdóttir',
    alt: 'Blaðagrein með fyrirsögninni „Djúpir litir koma sterkir inn“ og mynd af Katrínu',
  },
  {
    id: 'press-3',
    headline: 'Íslensku litirnir í forgrunni',
    alt: 'Blaðagrein um Hótel Heklu og gistiheimili með fyrirsögninni „Íslensku litirnir í forgrunni“',
  },
  {
    id: 'press-4',
    headline: 'Litir gefa heimilinu dýpt og karakter',
    alt: 'Tímaritsopna með fyrirsögninni „Litir gefa heimilinu dýpt og karakter“',
  },
  {
    id: 'press-5',
    headline: 'Arkitektónískt kameljón',
    alt: 'Tímaritsopna með fyrirsögninni „Arkitektónískt kameljón“ og myndum af eldhúsi og stofu',
  },
  {
    id: 'press-6',
    headline: 'Marmari og dökkir litir á baðið',
    alt: 'Blaðagrein á heimilis- og hönnunarsíðu með fyrirsögninni „Marmari og dökkir litir á baðið“',
  },
  {
    id: 'press-7',
    headline: 'Litríkt og hlýlegt',
    alt: 'Blaðagrein með fyrirsögninni „Litríkt og hlýlegt“ um heimili Katrínar í Álfheimum',
  },
  {
    id: 'press-8',
    headline: 'Grófur viður og mattar flísar á gólfið',
    alt: 'Blaðagrein með fyrirsögninni „Grófur viður og mattar flísar á gólfið“',
  },
  {
    id: 'press-9',
    headline: 'Finnst lífið litríkt og skemmtilegt',
    alt: 'Tímaritsopna með fyrirsögninni „Finnst lífið litríkt og skemmtilegt“',
  },
  {
    id: 'press-10',
    headline: 'Ég er með blandaðan stíl',
    alt: 'Tímaritsopna með fyrirsögninni „Ég er með blandaðan stíl“ og myndum úr svefnherbergi',
  },
  {
    id: 'press-11',
    headline: 'Umfjöllun um innanhússhönnun',
    alt: 'Tímaritsopna með myndum úr verkefnum Katrínar',
  },
]
