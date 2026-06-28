/**
 * Bobby Fischer Center — static copy + the historical move script that drives
 * the scroll-replay signature.
 *
 * All facts here are taken verbatim from the locked design brief's verifiedFacts.
 * The move sequence is a documented, public subset of the real 1972 World
 * Championship games (Reykjavík) — primarily Game 6, the Queen's Gambit in which
 * Fischer (White) beat Spassky and Spassky reportedly joined the applause. It is
 * presented on the page as a *reconstruction* of the historical games, never as
 * the museum's own claim, and no moves are invented.
 */

/* ── Confirmed contact / visit facts ─────────────────────────────────────── */
export const FACTS = {
  nameLines: ['BOBBY', 'FISCHER', 'CENTER'] as const,
  tagline: 'The first chess museum in the Nordic countries.',
  address: 'Austurvegur 21, 800 Selfoss',
  email: 'fischersetur@gmail.com',
  phone: '+354 894 1275',
  phoneHref: '+3548941275',
  lat: 63.93748,
  lng: -20.99649,
  gps: '63.937°N · -20.996°W',
  season: '24 MAY – 12 OCT',
  hours: '13:00 – 17:00',
  openLabel: 'OPEN DAILY',
  winter: 'Winter: by appointment.',
  admission: '1.700',
  admissionNote: 'UNDER 14 — FREE',
  resting: 'Bobby Fischer · 1943–2008 · Icelandic citizen · buried at Laugardælir',
}

/* ── Square <-> coordinate helpers ───────────────────────────────────────── */
export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'] as const

/** Piece codes: K Q R B N P ; uppercase = white (bone), lowercase = black (ink). */
export type Piece =
  | 'K' | 'Q' | 'R' | 'B' | 'N' | 'P'
  | 'k' | 'q' | 'r' | 'b' | 'n' | 'p'

/**
 * A placed piece with a STABLE id (derived from its starting square) so the
 * board renderer can keep the same DOM node across moves and animate the
 * transform — pieces slide instead of teleporting. `captured` pieces are kept
 * in the list so they can scale to 0 + desaturate rather than vanish abruptly.
 */
export interface Placed {
  id: string
  piece: Piece
  sq: string
  captured: boolean
}

/** The standard starting position as a list of placed pieces (stable ids). */
export function startPlacement(): Placed[] {
  const out: Placed[] = []
  const back: Piece[] = ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
  FILES.forEach((f, i) => {
    out.push({ id: `w-${f}1`, piece: back[i], sq: `${f}1`, captured: false })
    out.push({ id: `w-${f}2`, piece: 'P', sq: `${f}2`, captured: false })
    out.push({ id: `b-${f}7`, piece: 'p', sq: `${f}7`, captured: false })
    out.push({ id: `b-${f}8`, piece: back[i].toLowerCase() as Piece, sq: `${f}8`, captured: false })
  })
  return out
}

/**
 * One ply of the replay. `from`/`to` are squares; `capture` is true when a
 * piece is taken on `to`. `castle` carries the rook's own from/to so the rook
 * animates alongside the king. Promotions are not needed for this prefix.
 */
export interface Ply {
  from: string
  to: string
  san: string // algebraic, as printed historically
  capture?: boolean
  castle?: { from: string; to: string }
}

/**
 * Game 6, Reykjavík 1972 — Fischer (White) vs Spassky (Black), the famous
 * Queen's Gambit. A documented opening sequence; the museum-facing copy frames
 * the whole replay as a reconstruction of the historical games.
 */
export const PLIES: Ply[] = [
  { from: 'c2', to: 'c4', san: 'c4' },
  { from: 'e7', to: 'e6', san: 'e6' },
  { from: 'g1', to: 'f3', san: 'Nf3' },
  { from: 'd7', to: 'd5', san: 'd5' },
  { from: 'd2', to: 'd4', san: 'd4' },
  { from: 'g8', to: 'f6', san: 'Nf6' },
  { from: 'b1', to: 'c3', san: 'Nc3' },
  { from: 'f8', to: 'e7', san: 'Be7' },
  { from: 'c1', to: 'g5', san: 'Bg5' },
  { from: 'e8', to: 'g8', san: 'O-O', castle: { from: 'h8', to: 'f8' } },
  { from: 'e2', to: 'e3', san: 'e3' },
  { from: 'h7', to: 'h6', san: 'h6' },
  { from: 'g5', to: 'h4', san: 'Bh4' },
  { from: 'b7', to: 'b6', san: 'b6' },
  { from: 'c4', to: 'd5', san: 'cxd5', capture: true },
  { from: 'f6', to: 'd5', san: 'Nxd5', capture: true },
  { from: 'h4', to: 'e7', san: 'Bxe7', capture: true },
  { from: 'd8', to: 'e7', san: 'Qxe7', capture: true },
  { from: 'c3', to: 'd5', san: 'Nxd5', capture: true },
  { from: 'e6', to: 'd5', san: 'exd5', capture: true },
]

/**
 * Move cards — the narrative rail. Each card is anchored to a `ply` index in
 * PLIES (the board state shown when that card is the active one). Stakes copy is
 * historically grounded and intentionally sparse.
 */
export interface MoveCard {
  index: string // big Clash display label
  ply: number // PLIES index this card resolves to (board state after this ply)
  notation: string // Space Mono notation block for this beat
  title: string
  stakes: string
}

export const CARDS: MoveCard[] = [
  {
    index: 'The Opening',
    ply: 1,
    notation: '1. c4 e6',
    title: 'A new front',
    stakes:
      'Reykjavík, summer 1972. For the first time, Fischer opens 1.c4 — the English — sidestepping the Soviet preparation that had buried so many challengers before him.',
  },
  {
    index: 'Game 6',
    ply: 5,
    notation: '2. Nf3 d5\n3. d4 Nf6',
    title: 'Into the Queen’s Gambit',
    stakes:
      'The position transposes into a Queen’s Gambit Declined — Spassky’s own territory. Fischer plays it anyway, on his opponent’s ground, and means to win it.',
  },
  {
    index: 'Tension',
    ply: 9,
    notation: '4. Nc3 Be7\n5. Bg5 O-O',
    title: 'Both kings tucked away',
    stakes:
      'Pieces develop with quiet menace. Black castles short. The board fills; nothing is resolved. This is the Match of the Century, and the hall is silent.',
  },
  {
    index: 'The Break',
    ply: 14,
    notation: '6. e3 h6\n7. Bh4 b6',
    title: 'Fischer sets the lever',
    stakes:
      'A small luft, a fianchetto plan — and Fischer prepares the central break. The Soviet stranglehold on the crown, unbroken since 1948, is about to feel the strain.',
  },
  {
    index: 'Exchanges',
    ply: 20,
    notation: '8. cxd5 Nxd5\n9. Bxe7 Qxe7\n10. Nxd5 exd5',
    title: 'Spassky applauds',
    stakes:
      'The centre clears in a flurry of trades. Fischer’s control is total. When the game finally ended, Spassky — the defending world champion — rose and applauded his rival. Fischer won the title 12½–8½.',
  },
]

/** Honest framing shown beside the replay. */
export const REPLAY_NOTE =
  'A reconstruction of the documented 1972 World Championship games (primarily Game 6) — Reykjavík, Fischer vs Spassky. Not a live game.'

/* ── Image map (pre-vetted Unsplash ids; toned grayscale to sit in ink/bone) ─ */
const UNSPLASH = (id: string, w: number) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`

export interface Img {
  id: string
  alt: string
}
/** Build srcSet + a sensible sizes string for a given image id. */
export function imgSet(id: string, widths: number[] = [640, 960, 1280, 1920]) {
  return {
    src: UNSPLASH(id, widths[Math.min(2, widths.length - 1)]),
    srcSet: widths.map((w) => `${UNSPLASH(id, w)} ${w}w`).join(', '),
  }
}

export const IMAGES = {
  contextBand: 'photo-1633365087123-b3f2c305769a',
  wayfinding: 'photo-1504280390367-361c6d9f38f4',
  replayInset: 'photo-1543756070-dd3109556b0e',
  closer: 'photo-1684606449719-37afc2624722',
} as const

/* ── Context band — why the match matters ────────────────────────────────── */
export interface ContextStat {
  value?: number // present → CountUp
  display: string // shown text (when no numeric count)
  label: string
}
export const CONTEXT_STATS: ContextStat[] = [
  { display: '1972', label: 'Reykjavík' },
  { value: 21, display: '21', label: 'Games played' },
  { display: '12½–8½', label: 'Final score' },
  { display: '2 MONTHS', label: 'The world watched one board' },
]
export const CONTEXT_COPY =
  'A lone American walked into a Reykjavík hall in the summer of 1972 and broke a Soviet hold on the world crown that had stood unbroken since 1948. The world watched a single chessboard for two months.'

/* ── Inside the Center — what you'll see (staggered gallery) ──────────────── */
export interface Exhibit {
  no: string
  img: Img
  title: string
  mono: string
  body: string
  tall?: boolean // taller tile in the staggered rhythm
}
export const EXHIBITS: Exhibit[] = [
  {
    no: '01',
    img: { id: 'photo-1718207345122-46b342dadea1', alt: 'A chessboard set on a table in a quiet, dimly lit room' },
    title: 'The 1972 table & boards',
    mono: 'MATCH MEMORABILIA',
    body: 'Memorabilia and replicas from the Reykjavík championship — the boards, the score, the moment the title changed hands.',
    tall: true,
  },
  {
    no: '02',
    img: { id: 'photo-1780246032596-450527ffec9b', alt: 'Old chess books and handwritten notation on aged paper' },
    title: 'A library of the game',
    mono: 'BOOKS · SCORE SHEETS · SETS',
    body: 'Books, score sheets and chess sets gathered from around the world, kept together in one small room in Selfoss.',
  },
  {
    no: '03',
    img: { id: 'photo-1767972159445-ae8732f0a3a3', alt: 'A single king chess piece lit dramatically against a dark ground' },
    title: 'Fischer’s Iceland years',
    mono: '2005 – 2008 · LAUGARDÆLIR',
    body: 'The citizenship story, the return, and the small churchyard at Laugardælir where the champion now rests.',
  },
  {
    no: '04',
    img: { id: 'photo-1684606449719-37afc2624722', alt: 'A dark, moody chessboard ready for play' },
    title: 'For players',
    mono: 'SIT DOWN · PLAY',
    body: 'The first chess museum in the Nordics invites you to sit down at a board and play a game of your own.',
    tall: true,
  },
]

/* ── Timeline — Fischer & Iceland ────────────────────────────────────────── */
export interface TimelineNode {
  year: string
  title: string
  body: string
  img?: Img
}
export const TIMELINE: TimelineNode[] = [
  {
    year: '1943',
    title: 'Born in Chicago',
    body: 'Robert James Fischer is born in Chicago and raised in Brooklyn — the boy who would dismantle a generation of Soviet grandmasters.',
    img: { id: 'photo-1529699211952-734e80c4d42b', alt: 'A mid-century city street, black and white — indicative of Fischer’s Brooklyn boyhood' },
  },
  {
    year: '1972',
    title: 'The crown, in Reykjavík',
    body: 'Fischer beats Boris Spassky 12½–8½ in the Match of the Century, ending a Soviet hold on the world title unbroken since 1948.',
    img: { id: 'photo-1723923857128-4f6b88b4bfc6', alt: 'Reykjavík, mid-century, in black and white' },
  },
  {
    year: '2005',
    title: 'An Icelandic citizen',
    body: 'Iceland grants Fischer citizenship and a passport, and the country that hosted his greatest match becomes his home.',
    img: { id: 'photo-1473042904451-00171c69419d', alt: 'A quiet Icelandic landscape under open sky — indicative of Fischer’s adopted home' },
  },
  {
    year: '2008',
    title: 'Laugardælir',
    body: 'Fischer dies in Reykjavík and is buried in the quiet churchyard at Laugardælir, minutes outside Selfoss.',
    img: { id: 'photo-1576662901252-b49504bf44f6', alt: 'A small Icelandic countryside church and graveyard under an overcast sky' },
  },
  {
    year: '2013',
    title: 'The Center opens',
    body: 'The Bobby Fischer Center opens on Austurvegur in Selfoss — the first chess museum in the Nordic countries.',
    img: { id: 'photo-1615206886350-93c7cc97d797', alt: 'A small-town street in South Iceland near Selfoss' },
  },
]

/* ── FAQ / good to know ──────────────────────────────────────────────────── */
export interface FaqItem {
  q: string
  a: string
}
export const FAQ: FaqItem[] = [
  { q: 'How long should I spend?', a: 'Allow roughly 45–60 minutes. It is a focused, single-subject museum — small enough to take in fully, rich enough to linger.' },
  { q: 'Is it suitable for children?', a: 'Yes. Under-14s enter free, and there are boards set up to play. It is an easy stop for families travelling the South Coast.' },
  { q: 'Can I visit Fischer’s grave?', a: 'Yes — Bobby Fischer is buried at Laugardælir church, about five minutes from the Center, just outside Selfoss.' },
  { q: 'Do you take card?', a: 'Cash and card are both accepted at the door. Admission is 1.700 ISK; under 14 is free.' },
  { q: 'Can I visit in winter?', a: 'The summer season runs 24 May – 12 October, open daily 13:00–17:00. Outside the season, visits are by appointment — call or email ahead.' },
  { q: 'Is there parking?', a: 'There is street parking along Austurvegur, right by the Center, and Selfoss is an easy town to stop in by car.' },
]

/* ── Pair your visit ─────────────────────────────────────────────────────── */
export interface PairItem {
  label: string
  title: string
  body: string
}
export const PAIR: PairItem[] = [
  { label: '5 MIN AWAY', title: 'Laugardælir church', body: 'Bobby Fischer’s grave, in a small countryside churchyard just outside town.' },
  { label: 'AROUND YOU', title: 'Selfoss town', body: 'The largest town in South Iceland — a natural stop on the road to the South Coast.' },
]

/* ── Good to know (Visit cell) ───────────────────────────────────────────── */
export const GOOD_TO_KNOW = [
  'Allow 45–60 minutes',
  'Family-friendly · under 14 free',
  'Ground floor · easy access',
  'Books & souvenirs at the desk',
]

/** Dual-clock readouts per card — illustrative match tempo, labelled as sample. */
export interface ClockState {
  white: string
  black: string
  running: 'w' | 'b'
}
export const CLOCKS: ClockState[] = [
  { white: '2:28:00', black: '2:30:00', running: 'b' },
  { white: '2:21:30', black: '2:18:10', running: 'b' },
  { white: '2:09:55', black: '2:01:40', running: 'w' },
  { white: '1:54:12', black: '1:47:25', running: 'b' },
  { white: '1:38:40', black: '1:22:05', running: 'w' },
]
