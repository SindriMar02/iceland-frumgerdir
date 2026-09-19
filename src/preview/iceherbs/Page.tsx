import { useEffect, type CSSProperties } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Bendill, C, CSS, Haus, Merki, Ord, Reveal, step, useMjukSkrun, useWatchdog } from './ui'
import { BAETIEFNI, HUDVORUR, MIXTURUR, PAKKAR, GREINAR, kr, type Vara } from './products'
import {
  BLEK_A, FYRIRTAEKI, GRUNNAR, GRUNNROD, HERO_REITIR, JSON_LD, KOSTIR, SAGAN, SENDING, SETNING, SOLUSTADIR, TEXTI,
  TEYMI, TILVITNUN,
} from './data'

const company = getPreviewCompany('iceherbs')

const PAGE_CSS = `
/* Hero geometry is the reference's, measured off noho.ink at 1440x900:
   the section is exactly one viewport tall and split 50/50; the title
   block starts 116.6px (13vh) below the top of the left half; the right
   half is a 4-column x 3-row grid, 15px gap, tiles 175 x 230.83 (3:4),
   bottom-aligned with 45px of floor and 54px of inner left margin. */
.ih-hero{height:100svh;min-height:34rem;display:grid;grid-template-columns:1fr 1fr;
  align-items:stretch;padding:0;position:relative}
.ih-heroT{display:flex;flex-direction:column;padding:13svh var(--gut) var(--band)
  var(--gut);gap:1.4rem}
.ih-heroAr{font-variant-numeric:tabular-nums;color:var(--c-mosi)}
.ih-heroSlag{margin-top:auto;font-size:clamp(1rem,1.3vw,1.17rem);opacity:.78}

/* only 7 of the 12 cells carry a tile. The pattern is the reference's,
   read off its named grid areas: XX.. / .XXX / XX.. */
/* The reference's grid is not flush to the top of the viewport: its content
   starts 132.5px down a 900px hero and ends 45px off the floor, which is
   exactly what keeps it clear of the fixed header. Measured: 132.5 + 3 rows
   of 230.83 + 2 gaps of 15 + 45 = 900. This build had padding-top 0, so the
   tiles ran up under the nav. */
.ih-rist{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  gap:clamp(7px,1.04vw,15px);padding:14.72svh 0 5svh 3.75vw;align-content:stretch;height:100%}
.ih-reit{margin:0;overflow:hidden;position:relative;background:var(--grunnur,var(--c-flotur))}
.ih-reit img{position:absolute;inset:11%;width:78%;height:78%;object-fit:contain;
  transition:transform .8s var(--ease)}
.ih-reit:nth-child(1){grid-area:1/1/2/2} .ih-reit:nth-child(2){grid-area:1/2/2/3}
.ih-reit:nth-child(3){grid-area:2/2/3/3} .ih-reit:nth-child(4){grid-area:2/3/3/4}
.ih-reit:nth-child(5){grid-area:2/4/3/5} .ih-reit:nth-child(6){grid-area:3/1/4/2}
.ih-reit:nth-child(7){grid-area:3/2/4/3}
@media (hover:hover) and (pointer:fine){.ih-reit:hover img{transform:scale(1.06)}}

/* Below the split the two halves stack: the sentence keeps its own screen,
   the grid becomes a 3-column band with the same scatter rhythm. */
@media (max-width:900px){
  .ih-hero{height:auto;min-height:0;grid-template-columns:1fr;padding-bottom:var(--band)}
  /* the slogan follows the headline here; floor-anchoring it the way the
     desktop half does reopens the dead screenful this hero had before. */
  .ih-heroT{padding:calc(var(--band) / 1.1) var(--gut) 2.6rem 1.4rem;min-height:0;
    justify-content:flex-start;gap:0}
  .ih-heroSlag{margin-top:1.5rem}
  .ih-rist{grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);
    padding:0 var(--gut) 0 1.4rem;height:auto}
  .ih-reit{aspect-ratio:3/4}
  .ih-reit:nth-child(1){grid-area:1/1/2/2} .ih-reit:nth-child(2){grid-area:1/2/2/3}
  .ih-reit:nth-child(3){grid-area:2/2/3/3} .ih-reit:nth-child(4){grid-area:2/3/3/4}
  .ih-reit:nth-child(5){grid-area:3/1/4/2} .ih-reit:nth-child(6){grid-area:3/2/4/3}
  .ih-reit:nth-child(7){display:none}
}

/* the inline-image sentence: the reference's one unmistakable device.
   Chip is 48.7 x 43.5 against a 60.048px display, i.e. .81em x .72em,
   vertical-align:middle, no radius. */
.ih-setning{text-align:center;max-width:24ch;margin:0 auto}
.ih-setL{display:block}
.ih-setL > .ih-up{display:block}
.ih-setL span{margin:0 .1em}
.ih-bitiM{display:inline-block;vertical-align:middle;width:.81em;height:.72em;
  overflow:hidden;position:relative;margin:0 .12em .12em;background:var(--grunnur)}
.ih-bitiM img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain}

.ih-tilv{max-width:34ch;font-size:clamp(1.3rem,2.4vw,2.1rem);line-height:1.22;letter-spacing:-.02em;
  font-weight:500;margin:0}

/* Four lines, four cards. The reference shows two products at the size of
   a poster rather than a catalogue of rows, so these are full-bleed colour
   grounds with one product standing on each, not a price list. */
.ih-linur{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--col)}
@media (max-width:760px){.ih-linur{grid-template-columns:1fr;gap:var(--col)}}
.ih-spjaldL{position:relative;overflow:hidden;background:var(--grunnur);color:var(--blek);
  min-height:clamp(21rem,37vw,31rem);display:flex;flex-direction:column;
  padding:clamp(1.3rem,2.2vw,2.1rem);isolation:isolate}
.ih-spjaldL img{position:absolute;right:-4%;bottom:-6%;width:62%;height:78%;
  object-fit:contain;object-position:bottom right;z-index:-1;
  transition:transform .9s var(--ease)}
@media (hover:hover) and (pointer:fine){.ih-spjaldL:hover img{transform:scale(1.05) translateY(-1.5%)}}
.ih-spjaldL h3{margin:0;font-size:clamp(1.7rem,3.1vw,2.9rem);font-weight:600;
  letter-spacing:-.035em;line-height:1}
.ih-spjaldL .ih-ar{font-variant-numeric:tabular-nums;font-size:.82rem;letter-spacing:.14em;
  text-transform:uppercase;margin:0 0 auto;padding-top:.6rem;opacity:.85}
.ih-spjaldL .ih-nota{margin:1.2rem 0 0;font-size:.92rem;line-height:1.45;max-width:20ch;opacity:.92}
.ih-spjaldL .ih-fra{margin:.9rem 0 0;font-size:.92rem;font-weight:500;
  display:flex;align-items:baseline;gap:.6rem}
.ih-spjaldL .ih-fra b{font-size:1.3rem;font-weight:600;font-variant-numeric:tabular-nums}
.ih-tolur{display:flex;align-items:baseline;gap:.5rem;margin:0}
.ih-tolur b{font-size:clamp(2.6rem,5vw,4.4rem);font-weight:600;letter-spacing:-.04em;
  line-height:1;font-variant-numeric:tabular-nums}
.ih-tolur span{font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;opacity:.85}

.ih-kostir{display:grid;grid-template-columns:repeat(5,1fr);gap:var(--col)}
@media (max-width:991px){.ih-kostir{grid-template-columns:repeat(2,1fr);gap:1.6rem var(--col)}}
@media (max-width:479px){.ih-kostir{grid-template-columns:1fr;gap:1.3rem}}
.ih-kostur b{display:block;font-size:clamp(1.6rem,2.6vw,2.4rem);font-weight:600;letter-spacing:-.03em;
  font-variant-numeric:tabular-nums;line-height:1;color:var(--c-mosi)}
.ih-kostur strong{display:block;font-weight:500;margin:.55rem 0 .25rem}
.ih-kostur p{margin:0;font-size:.88rem;line-height:1.45;opacity:.78}

.ih-pakkar{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--col)}
@media (max-width:991px){.ih-pakkar{grid-template-columns:repeat(2,1fr)}}
@media (max-width:479px){.ih-pakkar{grid-template-columns:1fr}}
.ih-pakki{background:transparent;padding:0;display:flex;flex-direction:column;gap:.75rem;
  transition:transform .4s var(--ease)}
.ih-pakki figure{margin:0;aspect-ratio:4/5;overflow:hidden;position:relative;
  background:var(--grunnur,var(--c-flotur))}
.ih-pakki figure img{position:absolute;inset:9%;width:82%;height:82%;object-fit:contain;
  transition:transform .8s var(--ease)}
@media (hover:hover) and (pointer:fine){.ih-pakki:hover figure img{transform:scale(1.06)}}
.ih-pakki h3{margin:0;font-size:1rem;font-weight:500}
.ih-pakkiF{display:flex;align-items:baseline;justify-content:space-between;gap:.5rem;margin-top:auto}
@media (hover:hover) and (pointer:fine){.ih-pakki:hover{transform:translateY(-3px)}}
.ih-merki-frisending{font-size:.76rem;color:var(--c-mosi);font-weight:500}

.ih-hud{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--col)}
@media (max-width:991px){.ih-hud{grid-template-columns:repeat(2,1fr)}}
.ih-hud > figure{margin:0;background:transparent}
.ih-hud figure figure{margin:0;background:#fff;aspect-ratio:4/5;display:grid;place-items:center;padding:14%}
.ih-hud figcaption{margin-top:.6rem;font-size:.86rem;line-height:1.35}

.ih-saga{display:grid;gap:0}
.ih-sagaR{display:grid;grid-template-columns:5.5rem minmax(0,1fr) minmax(0,1.4fr);gap:var(--col);
  padding:1.35rem 0;box-shadow:inset 0 -1px 0 var(--c-lina);align-items:baseline}
@media (max-width:760px){.ih-sagaR{grid-template-columns:4.2rem 1fr;gap:.6rem var(--col)}
  .ih-sagaR p{grid-column:2}}
.ih-sagaR b{font-variant-numeric:tabular-nums;font-size:1.1rem;font-weight:600;color:var(--c-mosi)}
.ih-sagaR strong{font-weight:500}
.ih-sagaR p{margin:0;font-size:.92rem;line-height:1.5;opacity:.8}

.ih-teymi{display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem var(--col)}
@media (max-width:760px){.ih-teymi{grid-template-columns:1fr 1fr}}
@media (max-width:420px){.ih-teymi{grid-template-columns:1fr}}
.ih-teymi > div{padding-top:.7rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-teymi b{display:block;font-weight:500}
.ih-teymi span{font-size:.85rem;opacity:.72}

.ih-solu{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col)}
@media (max-width:760px){.ih-solu{grid-template-columns:1fr;gap:1.1rem}}
/* Child combinator, not a descendant one: each row is a .ih-mask wrapping
   a .ih-up riser, so a bare descendant selector matches both and paints the
   hairline twice. Caught on the iPhone, where the doubled rule is obvious. */
.ih-solu > div{padding-top:.8rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-solu b{display:block;font-size:1.15rem;font-weight:500;margin-bottom:.3rem}
.ih-solu p{margin:0;font-size:.88rem;opacity:.78;line-height:1.45}

.ih-greinar{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col)}
@media (max-width:900px){.ih-greinar{grid-template-columns:1fr;gap:1.2rem}}
.ih-grein{padding-top:.8rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-grein time{font-size:.8rem;font-variant-numeric:tabular-nums;opacity:.65}
.ih-grein h3{margin:.4rem 0 0;font-size:1.02rem;font-weight:500;line-height:1.3}

.ih-sending{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col)}
@media (max-width:760px){.ih-sending{grid-template-columns:1fr;gap:1.1rem}}
.ih-sending > div{padding-top:.8rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-sending b{display:block;font-weight:500}
.ih-sending em{font-style:normal;font-variant-numeric:tabular-nums;color:var(--c-mosi);font-weight:500}
.ih-sending p{margin:.3rem 0 0;font-size:.86rem;opacity:.78;line-height:1.45}

.ih-fotur{padding:var(--band) 0 2.5rem;background:var(--c-mosi);color:var(--c-bg)}
.ih-fotur .ih-slag{font-size:1em;font-weight:600;letter-spacing:-.045em;
  line-height:.9;margin:0 0 var(--band)}
.ih-foturRod{display:flex;flex-wrap:wrap;gap:1.4rem var(--col);justify-content:space-between;
  font-size:.86rem;line-height:1.6}
.ih-fotur a{text-decoration:underline;text-underline-offset:3px;display:inline-block;padding:.45rem 0;min-height:32px}
`

/* The bundle photographs ship with a solid white studio background baked
   in (alpha coverage 100%), so dropping them straight onto a colour tile
   renders a white box instead of the product. reitir/ holds a variant with
   that background flood-filled away from the four corners - a corner fill
   rather than -transparent white, which would have punched holes through
   the white labels. */
/* Every image path in products.ts and data.ts is site-absolute (/iceherbs/..),
   which resolves to the ORIGIN root on GitHub Pages, where this deploys under
   /iceland-frumgerdir/. Locally the two are identical, so the 404s only exist
   once it is live - caught by loading the deployed URL, not the dev server. */
const S = (img: string | null) =>
  img ? import.meta.env.BASE_URL + img.replace(/^\//, '') : ''

const reit = (img: string | null) =>
  img ? S(img.replace('/iceherbs/', '/iceherbs/reitir/')) : ''

function VoruLina({ titill, nota, ar, vorur, grunnur, mynd, n }: {
  titill: string; nota: string; ar: string; vorur: Vara[]
  grunnur: string; mynd: string; n: number
}) {
  const fra = Math.min(...vorur.map((v) => v.v))
  return (
    <Reveal className="ih-mask">
      <article className="ih-spjaldL ih-up" data-bendill="Skoða"
        style={{ ...step(n), '--grunnur': grunnur, '--blek': BLEK_A[grunnur] } as CSSProperties}>
        <img src={S(mynd)} alt={titill} width={420} height={560} loading="lazy" decoding="async" />
        <h3>{titill}</h3>
        <p className="ih-ar">{ar}</p>
        <p className="ih-tolur"><b>{vorur.length}</b><span>vörur</span></p>
        <p className="ih-nota">{nota}</p>
        <p className="ih-fra">Frá <b>{kr(fra)}</b></p>
      </article>
    </Reveal>
  )
}

export default function IceherbsPage() {
  useWatchdog()
  useMjukSkrun()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'ICEHERBS | Úr sama grasi síðan 1993'
    document.documentElement.lang = 'is'
    /* The iOS status strip tints from theme-color, so it has to follow the
       theme switch rather than being set once at mount, or a dark page keeps
       a paper-coloured strip above it. */
    const root = document.querySelector('.ih-root') as HTMLElement | null
    const syncTheme = () => setThemeColor(root?.dataset.tema === 'dokkt' ? '#1B211C' : C.pappirHreint)
    syncTheme()
    const mo = root ? new MutationObserver(syncTheme) : null
    mo?.observe(root as HTMLElement, { attributes: true, attributeFilter: ['data-tema'] })
    window.scrollTo(0, 0)
    return () => {
      mo?.disconnect()
      document.title = prevTitle; document.documentElement.lang = prevLang
    }
  }, [])


  return (
    <div className="ih-root">
      <style>{CSS}{PAGE_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Bendill />
      <Haus />

      <main>
        {/* hero. Left half: a four-line sentence, top-aligned. Right half:
            the reference's scattered 4x3 tile grid, bottom-aligned. ---- */}
        <section className="ih-hero">
          <Reveal className="ih-heroT">
            <div>
              <Merki>Kavita ehf. · Kópavogur og Blönduós</Merki>
              <h1 className="ih-disp">
                {TEXTI.heroLinur.map((l, i) => (
                  <span className="ih-mask" key={l}>
                    <span className="ih-up ih-lina" style={step(i)}>{l}</span>
                  </span>
                ))}
                <span className="ih-mask">
                  <span className="ih-up ih-lina ih-heroAr" style={step(TEXTI.heroLinur.length)}>
                    {TEXTI.heroAr}
                  </span>
                </span>
              </h1>
            </div>
            <p className="ih-heroSlag ih-mask">
              <span className="ih-up" style={step(TEXTI.heroLinur.length + 2)}>{TEXTI.heroUndir}</span>
            </p>
          </Reveal>
          <Reveal className="ih-rist">
            {HERO_REITIR.map((r, i) => (
              <figure className="ih-reit ih-mask" key={r.img} style={{ '--grunnur': r.grunnur } as CSSProperties}>
                <img className="ih-up" style={step(i)} src={S(r.img)} alt={r.n}
                  width={300} height={400} loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
              </figure>
            ))}
          </Reveal>
        </section>

        {/* the inline-image sentence, then their own words beneath it -- */}
        <section className="ih-band">
          <div className="ih-wrap">
            <Reveal>
              <h2 className="ih-disp ih-setning">
                {SETNING.map((lina, li) => (
                  <span className="ih-mask ih-setL" key={li}>
                    <span className="ih-up ih-lina" style={step(li)}>
                      {lina.map((b, i) =>
                        't' in b ? (
                          <span key={i}>{b.t}</span>
                        ) : (
                          <span className="ih-bitiM" key={i}
                            style={{ '--grunnur': b.grunnur } as CSSProperties}>
                            <img src={S(b.img)} alt={b.n} width={120} height={106}
                              loading="lazy" decoding="async" />
                          </span>
                        ),
                      )}
                    </span>
                  </span>
                ))}
              </h2>
            </Reveal>
            <Reveal className="ih-mask ih-maskP" style={{ marginTop: 'clamp(2.4rem,5vw,4.4rem)' }}>
              <p className="ih-tilv ih-up">{TILVITNUN}</p>
            </Reveal>
          </div>
        </section>

        {/* the four lines --------------------------------------- */}
        <section className="ih-band" id="vorur">
          <div className="ih-wrap">
            <Merki>Vörurnar</Merki>
            <Ord className="ih-disp" text={'Fjórar línur,' + ' | ' + 'eitt hráefni'} />
            <p className="ih-brod ih-mask" style={{ marginTop: '1.4rem', marginBottom: 'var(--band)' }}>
              <span className="ih-up" style={step(2)}>{TEXTI.familiurInn}</span>
            </p>
            <div className="ih-linur">
              <VoruLina n={0} titill="Mixtúrur" ar="Síðan 1995"
                nota="Hálsmixtúrur, hóstamixtúrur og krakkamixtúrur úr fjallagrösum."
                vorur={MIXTURUR} grunnur={GRUNNAR.ploma}
                mynd="/iceherbs/reitir/230010_ICEHERBS-HALSMIXTURA-LAKKRIS-200ML_600X600.webp" />
              <VoruLina n={1} titill="Bætiefni" ar="Síðan 2012"
                nota="Hrein bætiefni í hylkjum, þróuð og framleidd á Blönduósi."
                vorur={BAETIEFNI} grunnur={GRUNNAR.engifer}
                mynd="/iceherbs/reitir/220240_ICEHERBS-C-VITAMIN-ENGIFER-FLENSUBANI-60-HYLKI_600X600.webp" />
              <VoruLina n={1} titill="Húðvörur" ar="Síðan 2017"
                nota="ICEHERBS SKIN. Byrjaði á varasalvum með fjallagrösum."
                vorur={HUDVORUR} grunnur={GRUNNAR.jokull}
                mynd="/iceherbs/reitir/3D-ermi-framm-Hand.webp" />
              <VoruLina n={2} titill="Pakkar" ar="Eftir líðan"
                nota="Settir saman eftir því hvernig fólki líður, ekki eftir vöruflokki."
                vorur={PAKKAR} grunnur={GRUNNAR.nott}
                mynd="/iceherbs/reitir/3D-mix-Sofdurott-600x600-1.webp" />
            </div>
          </div>
        </section>

        {/* five facts ------------------------------------------- */}
        <section className="ih-band">
          <div className="ih-wrap">
            <Merki>Þess vegna</Merki>
            <Reveal className="ih-kostir" style={{ marginTop: '2.4rem' }}>
              {KOSTIR.map((k, i) => (
                <div className="ih-kostur ih-mask" key={k.t}>
                  <div className="ih-up" style={step(i)}>
                    <b>{k.n}</b><strong>{k.t}</strong><p>{k.d}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* bundles: the merchandising fix ----------------------- */}
        <section className="ih-band" id="pakkar">
          <div className="ih-wrap">
            <Merki>Pakkar</Merki>
            <Ord className="ih-disp" text="Eftir líðan, | ekki vöruflokki" />
            <p className="ih-brod ih-mask" style={{ marginTop: '1.4rem', marginBottom: '2.6rem' }}>
              <span className="ih-up" style={step(2)}>{TEXTI.pakkarInn}</span>
            </p>
            <Reveal className="ih-pakkar">
              {PAKKAR.slice(0, 8).map((p, i) => (
                <article className="ih-pakki ih-mask" key={p.n} data-bendill="Skoða"
                  style={{ '--grunnur': GRUNNROD[i % GRUNNROD.length] } as CSSProperties}>
                  <div className="ih-up" style={step(i % 4)}>
                    <figure>{p.img ? <img src={reit(p.img)} alt={p.n} width={300} height={375} loading="lazy" decoding="async" /> : null}</figure>
                    <h3>{p.n}</h3>
                    <div className="ih-pakkiF">
                      <span className="ih-verd">{kr(p.v)}</span>
                      <span className="ih-merki-frisending">+ sending</span>
                    </div>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* skin ------------------------------------------------- */}
        <section className="ih-band" id="skin">
          <div className="ih-wrap">
            <Merki>ICEHERBS SKIN</Merki>
            <p className="ih-brod ih-mask" style={{ marginBottom: '2.4rem' }}>
              <span className="ih-up">{TEXTI.hudInn}</span>
            </p>
            <Reveal className="ih-hud">
              {HUDVORUR.slice(0, 4).map((h, i) => (
                <figure key={h.n} style={{ margin: 0 }}>
                  <div className="ih-mask">
                    <figure className="ih-up" style={step(i)}>
                      {h.img ? <img src={S(h.img)} alt={h.n} width={400} height={500} loading="lazy" decoding="async" /> : null}
                    </figure>
                  </div>
                  <figcaption>{h.n}<br /><span className="ih-verd">{kr(h.v)}</span></figcaption>
                </figure>
              ))}
            </Reveal>
          </div>
        </section>

        {/* history ---------------------------------------------- */}
        <section className="ih-band" id="sagan">
          <div className="ih-wrap">
            <Merki>Sagan</Merki>
            <Ord className="ih-disp" text="Grösin voru flutt út | óunnin. Þangað til." />
            <p className="ih-brod ih-mask" style={{ marginTop: '1.4rem', marginBottom: '2.6rem' }}>
              <span className="ih-up" style={step(2)}>{TEXTI.sjalfbaerni}</span>
            </p>
            <Reveal className="ih-saga">
              {SAGAN.map((s, i) => (
                <div className="ih-sagaR ih-mask" key={s.ar}>
                  <b className="ih-up" style={step(i)}>{s.ar}</b>
                  <strong className="ih-up" style={step(i)}>{s.titill}</strong>
                  <p className="ih-up" style={step(i)}>{s.texti}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* team ------------------------------------------------- */}
        <section className="ih-band">
          <div className="ih-wrap">
            <Merki>Teymið</Merki>
            <p className="ih-brod ih-mask" style={{ marginBottom: '2.4rem' }}>
              <span className="ih-up">{TEXTI.umInn}</span>
            </p>
            <Reveal className="ih-teymi">
              {TEYMI.map((t, i) => (
                <div className="ih-mask" key={t.nafn}>
                  <div className="ih-up" style={step(i % 3)}>
                    <b>{t.nafn}</b><span>{t.hlutverk}</span>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* stockists: the page they do not have ----------------- */}
        <section className="ih-band" id="solustadir">
          <div className="ih-wrap">
            <Merki>Sölustaðir</Merki>
            <Ord className="ih-disp" text="Líka til í hillu" />
            <p className="ih-brod ih-mask" style={{ marginTop: '1.4rem', marginBottom: '2.4rem' }}>
              <span className="ih-up" style={step(2)}>{TEXTI.solustadirInn}</span>
            </p>
            <Reveal className="ih-solu">
              {SOLUSTADIR.map((s, i) => (
                <div className="ih-mask" key={s.nafn}>
                  <div className="ih-up" style={step(i)}><b>{s.nafn}</b><p>{s.nota}</p></div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* articles --------------------------------------------- */}
        <section className="ih-band" id="greinar">
          <div className="ih-wrap">
            <Merki>Greinar</Merki>
            <p className="ih-brod ih-mask" style={{ marginBottom: '2.4rem' }}>
              <span className="ih-up">{TEXTI.greinarInn}</span>
            </p>
            <Reveal className="ih-greinar">
              {GREINAR.slice(0, 3).map((g, i) => (
                <article className="ih-grein ih-mask" key={g.s} data-bendill="Lesa">
                  <div className="ih-up" style={step(i)}>
                    <time dateTime={g.d}>{g.d}</time>
                    <h3>{g.t}</h3>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* delivery --------------------------------------------- */}
        <section className="ih-band">
          <div className="ih-wrap">
            <Merki>Afhending</Merki>
            <Ord className="ih-disp" text="Frítt yfir 12.000 kr." />
            <Reveal className="ih-sending" style={{ marginTop: '2.4rem' }}>
              {SENDING.map((s, i) => (
                <div className="ih-mask" key={s.leid}>
                  <div className="ih-up" style={step(i)}>
                    <b>{s.leid}</b><em>{s.verd}</em><p>{s.nota}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* footer ----------------------------------------------- */}
        <footer className="ih-fotur">
          <div className="ih-wrap">
            <Reveal className="ih-mask ih-slagM">
              <p className="ih-slag ih-up">{TEXTI.fotur}</p>
            </Reveal>
            <div className="ih-foturRod">
              <div>
                {FYRIRTAEKI.logadi}<br />{FYRIRTAEKI.heimili}<br />
                Framleiðsla: {FYRIRTAEKI.framleidsla}
              </div>
              <div>
                <a href={FYRIRTAEKI.simiHref}>{FYRIRTAEKI.simi}</a><br />
                <a href={`mailto:${FYRIRTAEKI.netfang}`}>{FYRIRTAEKI.netfang}</a>
              </div>
              <div>Kt. {FYRIRTAEKI.kt}</div>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
