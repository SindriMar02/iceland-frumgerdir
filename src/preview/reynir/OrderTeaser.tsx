/**
 * Reynir bakari — the homepage's order block.
 *
 * The full configurator lives on its own route (/preview/reynir/panta) because
 * a 2.700px stateful form in the middle of an editorial page breaks the story
 * and mixes two different visitor mindsets: browsing and ordering. What stays
 * here is the invitation, roughly a sixth of the height.
 *
 * Each product links straight through with ?vara=<id> so the choice a visitor
 * already made on the homepage is not asked again on arrival.
 */

import { Link } from 'react-router-dom'
import type { Lang } from './data'
import { ORDER_T, isk } from './order'
import { DIM, DISPLAY, EASE, GOLD, GOLD_LIGHT, GOLD_TEXT, HAIR, INK_DEEP, IVORY } from './tokens'
import { useSiteContent } from './sanity'

const TEASER_CSS = `
  /* Flex + centred remainder, not a 3-col grid: the owner can add or remove a
     product in the CMS and the row never leaves an empty cell. See OrderSection. */
  .rb-tease-grid { display:flex; flex-wrap:wrap; justify-content:center; gap:10px;
    margin-top:clamp(26px,4vh,38px); }
  .rb-tease-grid > * { flex:1 1 240px; max-width:calc(33.333% - 7px); }
  .rb-tease-card { display:flex; flex-direction:column; gap:7px; text-decoration:none;
    padding:20px 18px; border:1px solid ${HAIR}; border-radius:4px; background:rgba(243,234,211,.02);
    overflow:hidden;
    transition:border-color .24s ${EASE}, background .24s ${EASE}, transform .2s ${EASE}; }
  /* Optional product photo — a product without one still renders a full card. */
  .rb-tease-pic { margin:-20px -18px 12px; aspect-ratio:4 / 3; overflow:hidden; background:#0B0A09; }
  .rb-tease-pic img { width:100%; height:100%; object-fit:cover; display:block;
    filter:saturate(.96) brightness(.92); transition:transform .55s ${EASE}, filter .4s ${EASE}; }
  .rb-tease-card:hover .rb-tease-pic img { transform:scale(1.045); filter:saturate(1) brightness(1); }
  .rb-tease-card:hover { border-color:${GOLD}; background:rgba(200,168,119,.08); transform:translateY(-2px); }
  .rb-tease-card:focus-visible { outline:2px solid ${GOLD}; outline-offset:3px; }
  .rb-tease-name { font-family:${DISPLAY}; font-size:clamp(20px,2.1vw,25px); color:${IVORY}; line-height:1.15;
    transition:color .24s ${EASE}; }
  .rb-tease-card:hover .rb-tease-name { color:${GOLD_LIGHT}; }
  .rb-tease-from { font-size:12.5px; color:${DIM}; font-variant-numeric:tabular-nums; }
  .rb-tease-blurb { font-size:13.5px; color:${DIM}; line-height:1.5; margin-top:2px; }

  .rb-tease-foot { display:flex; align-items:center; gap:18px; flex-wrap:wrap;
    margin-top:clamp(26px,4vh,36px); }
  .rb-tease-note { font-size:13.5px; color:${DIM}; line-height:1.55; max-width:44ch; }

  @media (max-width:860px) { .rb-tease-grid > * { max-width:100%; flex-basis:100%; } }
  @media (prefers-reduced-motion: reduce) {
    .rb-tease-card { transition:none; }
    .rb-tease-card:hover { transform:none; }
  }
`

export default function OrderTeaser({ lang, orderPath }: { lang: Lang; orderPath: string }) {
  const t = ORDER_T[lang]
  const { ORDER_PRODUCTS } = useSiteContent()

  return (
    <section id="order" style={{ background: INK_DEEP, padding: 'clamp(80px,11vh,140px) clamp(20px,4.5vw,72px)' }}>
      <style>{TEASER_CSS}</style>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        {/* The rule spans the container, as it does in every other section;
            only the text is capped. Carrying the cap on the same element cut
            the hairline to 640px and made this one divider look broken next
            to its neighbours. */}
        <div data-reveal style={{ borderTop: `1px solid ${HAIR}`, paddingTop: 16 }}>
          <div style={{ maxWidth: 640 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.24em', textTransform: 'uppercase', color: GOLD }}>
            {t.kicker}
          </div>
          <h2 style={{ fontFamily: DISPLAY, fontWeight: 400, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.03, margin: '18px 0 0', ...GOLD_TEXT }}>
            {t.title}
          </h2>
            <p style={{ fontSize: 16, color: DIM, margin: '16px 0 0', lineHeight: 1.65 }}>{t.intro}</p>
          </div>
        </div>

        <div className="rb-tease-grid">
          {ORDER_PRODUCTS.map((p) => (
            <Link key={p.id} to={`${orderPath}?vara=${p.id}`} className="rb-tease-card">
              {p.image && (
                <span className="rb-tease-pic">
                  <img src={p.image} alt="" loading="lazy" decoding="async" width={1400} height={1050} />
                </span>
              )}
              <span className="rb-tease-name">{p.name[lang]}</span>
              <span className="rb-tease-from">{lang === 'is' ? 'frá' : 'from'} {isk(p.basePrice)}</span>
              <span className="rb-tease-blurb">{p.blurb[lang]}</span>
            </Link>
          ))}
        </div>

        <div className="rb-tease-foot">
          <Link to={orderPath} className="rb-cta rb-cta-gold">{t.teaseCta}</Link>
          <span className="rb-tease-note">{t.teaseNote}</span>
        </div>
      </div>
    </section>
  )
}
