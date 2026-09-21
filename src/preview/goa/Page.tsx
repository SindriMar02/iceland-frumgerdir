import { useEffect, type CSSProperties } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Bendill, C, CSS, Haus, Merki, Ord, Reveal, step, useMjukSkrun, useWatchdog } from './ui'
import { Poki, POKA_CSS, SettIPoka, poki } from './poki'
import { Hledsla, HLEDSLA_CSS } from './hledsla'
import { Nammiregn, REGN_CSS } from './regn'
import { EGGIN, FJOLDI, HILLAN } from './products'
import {
  BLEK_A, ERINDI, FYRIRTAEKI, GRUNNAR, HERO_REITIR, JSON_LD, KOSTIR, OPNUN, SAGAN, SETNING, TEXTI, TEYMI, TILVITNUN,
} from './data'

const company = getPreviewCompany('goa')

const PAGE_CSS = `
/* Hero geometry is the reference's, measured off noho.ink at 1440x900:
   the section is exactly one viewport tall and split 50/50; the title
   block starts 116.6px (13vh) below the top of the left half; the right
   half is a 4-column x 3-row grid, 15px gap, tiles 175 x 230.83 (3:4),
   bottom-aligned with 45px of floor and 54px of inner left margin. */
.goa-hero{height:100svh;min-height:34rem;display:grid;grid-template-columns:1fr 1fr;
  align-items:stretch;padding:0;position:relative}
.goa-heroT{display:flex;flex-direction:column;padding:13svh var(--gut) var(--band)
  var(--gut);gap:1.4rem}
.goa-heroAr{font-variant-numeric:tabular-nums;color:var(--c-rautt)}
.goa-heroSlag{margin-top:auto;font-size:clamp(1rem,1.3vw,1.17rem);opacity:.78}

/* only 7 of the 12 cells carry a tile. The pattern is the reference's,
   read off its named grid areas: XX.. / .XXX / XX.. */
/* The reference's grid is not flush to the top of the viewport: its content
   starts 132.5px down a 900px hero and ends 45px off the floor, which is
   exactly what keeps it clear of the fixed header. Measured: 132.5 + 3 rows
   of 230.83 + 2 gaps of 15 + 45 = 900. This build had padding-top 0, so the
   tiles ran up under the nav. */
.goa-rist{display:grid;grid-template-columns:repeat(4,1fr);grid-template-rows:repeat(3,1fr);
  gap:clamp(7px,1.04vw,15px);padding:14.72svh 0 5svh 3.75vw;align-content:stretch;height:100%}
.goa-reit{margin:0;overflow:hidden;position:relative;background:var(--grunnur,var(--c-flotur))}
.goa-reit img{position:absolute;inset:9%;width:82%;height:82%;object-fit:contain;
  filter:drop-shadow(0 14px 18px rgba(28,18,12,.28));transition:transform .8s var(--ease)}
.goa-reit:nth-child(1){grid-area:1/1/2/2} .goa-reit:nth-child(2){grid-area:1/2/2/3}
.goa-reit:nth-child(3){grid-area:2/2/3/3} .goa-reit:nth-child(4){grid-area:2/3/3/4}
.goa-reit:nth-child(5){grid-area:2/4/3/5} .goa-reit:nth-child(6){grid-area:3/1/4/2}
.goa-reit:nth-child(7){grid-area:3/2/4/3}
@media (hover:hover) and (pointer:fine){.goa-reit:hover img{transform:scale(1.06)}}

/* Below the split the two halves stack: the sentence keeps its own screen,
   the grid becomes a 3-column band with the same scatter rhythm. */
@media (max-width:900px){
  .goa-hero{height:auto;min-height:0;grid-template-columns:1fr;padding-bottom:var(--band)}
  /* the slogan follows the headline here; floor-anchoring it the way the
     desktop half does reopens the dead screenful this hero had before. */
  /* the crest makes this header taller than Iceherbs' wordmark did, so the
     eyebrow has to clear the header's real height, not a band fraction */
  .goa-heroT{padding:max(calc(var(--band) / 1.1),calc(var(--haus-h,68px) + 1.6rem)) var(--gut) 2.6rem 1.4rem;min-height:0;
    justify-content:flex-start;gap:0}
  .goa-heroSlag{margin-top:1.5rem}
  .goa-rist{grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(3,1fr);
    padding:0 var(--gut) 0 1.4rem;height:auto}
  .goa-reit{aspect-ratio:3/4}
  .goa-reit:nth-child(1){grid-area:1/1/2/2} .goa-reit:nth-child(2){grid-area:1/2/2/3}
  .goa-reit:nth-child(3){grid-area:2/2/3/3} .goa-reit:nth-child(4){grid-area:2/3/3/4}
  .goa-reit:nth-child(5){grid-area:3/1/4/2} .goa-reit:nth-child(6){grid-area:3/2/4/3}
  .goa-reit:nth-child(7){display:none}
}

/* the inline-image sentence: the reference's one unmistakable device.
   Chip is 48.7 x 43.5 against a 60.048px display, i.e. .81em x .72em,
   vertical-align:middle, no radius. */
.goa-setning{text-align:center;max-width:24ch;margin:0 auto}
.goa-setL{display:block}
.goa-setL > .goa-up{display:block}
.goa-setL span{margin:0 .1em}
.goa-bitiM{display:inline-block;vertical-align:middle;width:calc(.81em * var(--b,1));height:.72em;
  overflow:hidden;position:relative;margin:0 .12em .12em;background:var(--grunnur)}
.goa-bitiM img{position:absolute;inset:6%;width:88%;height:88%;object-fit:contain}

.goa-tilv{max-width:34ch;font-size:clamp(1.3rem,2.4vw,2.1rem);line-height:1.22;letter-spacing:-.02em;
  font-weight:500;margin:0}

/* Four lines, four cards. The reference shows two products at the size of
   a poster rather than a catalogue of rows, so these are full-bleed colour
   grounds with one product standing on each, not a price list. */
.goa-linur{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--col)}
@media (max-width:760px){.goa-linur{grid-template-columns:1fr;gap:var(--col)}}
.goa-spjaldL{position:relative;overflow:hidden;background:var(--grunnur);color:var(--blek);
  min-height:clamp(21rem,37vw,31rem);display:flex;flex-direction:column;
  padding:clamp(1.3rem,2.2vw,2.1rem);isolation:isolate}
.goa-spjaldL img{position:absolute;right:-4%;bottom:-6%;width:62%;height:78%;
  object-fit:contain;object-position:bottom right;z-index:-1;
  transition:transform .9s var(--ease)}
@media (hover:hover) and (pointer:fine){.goa-spjaldL:hover img{transform:scale(1.05) translateY(-1.5%)}}
.goa-spjaldL h3{margin:0;font-size:clamp(1.7rem,3.1vw,2.9rem);font-weight:600;
  letter-spacing:-.035em;line-height:1}
.goa-spjaldL .goa-ar{font-variant-numeric:tabular-nums;font-size:.82rem;letter-spacing:.14em;
  text-transform:uppercase;margin:0 0 auto;padding-top:.6rem;opacity:.85}
.goa-spjaldL .goa-nota{margin:1.2rem 0 0;font-size:.92rem;line-height:1.45;max-width:20ch;opacity:.92}
.goa-spjaldL .goa-fra{margin:.9rem 0 0;font-size:.92rem;font-weight:500;display:inline-flex;
  align-items:center;gap:.4rem;min-height:44px}
.goa-spjaldL .goa-fra::after{content:'→';transition:transform .25s ease-out}
@media (hover:hover) and (pointer:fine){.goa-spjaldL:hover .goa-fra::after{transform:translateX(4px)}}
.goa-tolur{display:flex;align-items:baseline;gap:.5rem;margin:0}
.goa-tolur b{font-size:clamp(2.6rem,5vw,4.4rem);font-weight:600;letter-spacing:-.04em;
  line-height:1;font-variant-numeric:tabular-nums}
.goa-tolur span{font-size:.82rem;letter-spacing:.14em;text-transform:uppercase;opacity:.85}

.goa-kostir{display:grid;grid-template-columns:repeat(5,1fr);gap:var(--col)}
@media (max-width:991px){.goa-kostir{grid-template-columns:repeat(2,1fr);gap:1.6rem var(--col)}}
@media (max-width:479px){.goa-kostir{grid-template-columns:1fr;gap:1.3rem}}
.goa-kostur b{display:block;font-size:clamp(1.6rem,2.6vw,2.4rem);font-weight:600;letter-spacing:-.03em;
  font-variant-numeric:tabular-nums;line-height:1;color:var(--c-rautt)}
.goa-kostur strong{display:block;font-weight:500;margin:.55rem 0 .25rem}
.goa-kostur p{margin:0;font-size:.88rem;line-height:1.45;opacity:.78}

.goa-hillan{display:grid;grid-template-columns:repeat(4,1fr);gap:clamp(1.6rem,3vw,2.6rem) var(--col)}
@media (max-width:991px){.goa-hillan{grid-template-columns:repeat(2,1fr)}}
@media (max-width:420px){.goa-hillan{grid-template-columns:1fr 1fr;gap:1.4rem .8rem}}
.goa-vara{display:flex;flex-direction:column;gap:.55rem;height:100%}
.goa-vara figure{margin:0;aspect-ratio:4/5;overflow:hidden;position:relative;background:var(--grunnur);
  display:grid;place-items:center;padding:12%}
.goa-vara figure img{width:100%;height:100%;object-fit:contain;
  filter:drop-shadow(0 12px 16px rgba(28,18,12,.26));transition:transform .8s var(--ease)}
@media (hover:hover) and (pointer:fine){.goa-vara:hover figure img{transform:scale(1.06) rotate(-1.5deg)}}
.goa-vara h3{margin:.2rem 0 0;font-size:1.02rem;font-weight:500;line-height:1.25}
.goa-vara dl{margin:0;display:grid;grid-template-columns:auto 1fr;gap:.1rem .7rem;font-size:.8rem;
  font-variant-numeric:tabular-nums}
.goa-vara dt{opacity:.62}
.goa-vara dd{margin:0}
.goa-varaF{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin-top:auto;flex-wrap:wrap}
.goa-varaF a{font-size:.8rem;text-decoration:underline;text-underline-offset:3px;min-height:44px;
  display:inline-flex;align-items:center}
@media (max-width:420px){.goa-varaF .goa-sett{width:100%;justify-content:center}}

.goa-eggin{display:grid;grid-template-columns:repeat(8,1fr);gap:var(--col);align-items:end}
@media (max-width:991px){.goa-eggin{grid-template-columns:repeat(4,1fr);row-gap:2rem}}
/* On a phone eight eggs in two columns ran to four screens. They become one
   shelf you swipe along instead, which is also how they stand in a shop. */
@media (max-width:620px){.goa-eggin{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:40%;
  overflow-x:auto;scroll-snap-type:x mandatory;margin:0 calc(var(--gut) * -1);padding:0 var(--gut) .6rem;
  scroll-padding:0 var(--gut);scrollbar-width:none;overscroll-behavior-x:contain}
  .goa-eggin::-webkit-scrollbar{display:none}
  .goa-egg{scroll-snap-align:start}}
.goa-egg{margin:0}
.goa-egg img{width:calc(100% * var(--s,1));height:auto;margin:0 auto;transition:transform .8s var(--ease);
  filter:drop-shadow(0 16px 20px rgba(28,18,12,.3))}
@media (hover:hover) and (pointer:fine){.goa-egg:hover img{transform:translateY(-6px)}}
.goa-egg figcaption{margin-top:.8rem;font-size:.84rem;line-height:1.35;min-height:4.1em}
.goa-egg figcaption span{display:block;opacity:.65;font-variant-numeric:tabular-nums}

.goa-saga{display:grid;gap:0}
.goa-sagaR{display:grid;grid-template-columns:5.5rem minmax(0,1fr) minmax(0,1.4fr);gap:var(--col);
  padding:1.35rem 0;box-shadow:inset 0 -1px 0 var(--c-lina);align-items:baseline}
@media (max-width:760px){.goa-sagaR{grid-template-columns:4.2rem 1fr;gap:.6rem var(--col)}
  .goa-sagaR p{grid-column:2}}
.goa-sagaR b{font-variant-numeric:tabular-nums;font-size:1.1rem;font-weight:600;color:var(--c-rautt)}
.goa-sagaR strong{font-weight:500}
.goa-sagaR p{margin:0;font-size:.92rem;line-height:1.5;opacity:.8}

.goa-teymi{display:grid;grid-template-columns:repeat(4,1fr);gap:1.1rem var(--col)}
@media (max-width:900px){.goa-teymi{grid-template-columns:1fr 1fr}}
@media (max-width:420px){.goa-teymi{grid-template-columns:1fr}}
.goa-teymi > div{padding-top:.7rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.goa-teymi b{display:block;font-weight:500}
.goa-teymi span{font-size:.85rem;opacity:.72;display:block}
.goa-teymi a{font-size:.88rem;text-decoration:underline;text-underline-offset:3px;display:inline-flex;
  align-items:center;min-height:44px}

/* The four errands. Not cards: a numbered index with a hairline, the
   reference's grouping, each with one action. */
.goa-erindi{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--col)}
@media (max-width:991px){.goa-erindi{grid-template-columns:1fr 1fr;row-gap:2rem}}
@media (max-width:560px){.goa-erindi{grid-template-columns:1fr;row-gap:1.4rem}}
.goa-erindi > div{padding-top:.9rem;box-shadow:inset 0 1px 0 var(--c-lina);height:100%}
.goa-erindi > div > div{display:flex;flex-direction:column;height:100%;gap:.45rem}
.goa-erindi i{font-style:normal;font-variant-numeric:tabular-nums;font-size:.8rem;opacity:.6}
.goa-erindi b{font-size:clamp(1.25rem,1.8vw,1.6rem);font-weight:600;letter-spacing:-.03em;line-height:1.1}
.goa-erindi p{margin:0;font-size:.92rem;line-height:1.5;opacity:.84}
.goa-erindi a{margin-top:auto;font-weight:500;display:inline-flex;align-items:center;gap:.4rem;min-height:44px;
  color:var(--c-rautt)}
.goa-erindi a::after{content:'→';transition:transform .25s ease-out}
@media (hover:hover) and (pointer:fine){.goa-erindi a:hover::after{transform:translateX(4px)}}

.goa-opnun{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col)}
@media (max-width:760px){.goa-opnun{grid-template-columns:1fr;gap:1.1rem}}
.goa-opnun > div{padding-top:.8rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.goa-opnun b{display:block;font-weight:500}
.goa-opnun em{font-style:normal;font-variant-numeric:tabular-nums;color:var(--c-rautt);font-weight:600;
  font-size:1.35rem;letter-spacing:-.02em;display:block;margin-top:.2rem;overflow-wrap:anywhere}
.goa-opnun p{margin:.3rem 0 0;font-size:.86rem;opacity:.78;line-height:1.45}

/* red ground, paper ink: 5.48:1. In the dark theme the red token turns gold,
   so the footer pins its own colours rather than following the tokens. */
.goa-fotur{padding:var(--band) 0 2.5rem;background:#C21514;color:#F8F1E4}
.goa-foturM{width:clamp(15rem,40vw,36rem);margin:0 auto var(--band);padding-top:1rem}
.goa-foturM img{width:100%;height:auto;transform:translateY(104%);transform-origin:50% 100%;
  transition:transform 1.4s var(--ease)}
.on.goa-foturM img,.goa-foturM.on img{transform:translateY(0)}
.goa-root.goa-allt .goa-foturM img{transform:none}
@media (hover:hover) and (pointer:fine){.goa-foturM.on img:hover{transform:rotate(-2deg) scale(1.02);transition-duration:.5s}}
.goa-fotur .goa-slag{font-size:1em;font-weight:600;letter-spacing:-.045em;
  line-height:.9;margin:0 0 var(--band)}
.goa-foturRod{display:flex;flex-wrap:wrap;gap:1.4rem var(--col);justify-content:space-between;
  font-size:.86rem;line-height:1.6}
.goa-fotur a{text-decoration:underline;text-underline-offset:3px;display:inline-block;padding:.45rem 0;min-height:32px}
`

/* Every image path is site-absolute (/goa/..) and resolves against BASE_URL,
   because the preview deploys under /iceland-frumgerdir/ on GitHub Pages. */
const S = (img: string) => import.meta.env.BASE_URL + img.replace(/^\//, '')

function Lina({ titill, nota, ar, fjoldi, grunnur, mynd, n, til }: {
  titill: string; nota: string; ar: string; fjoldi: number
  grunnur: string; mynd: string; n: number; til: string
}) {
  return (
    <Reveal className="goa-mask">
      <a className="goa-spjaldL goa-up" href={til} data-bendill="Skoða"
        style={{ ...step(n), '--grunnur': grunnur, '--blek': BLEK_A[grunnur], color: BLEK_A[grunnur] } as CSSProperties}>
        <img src={S(mynd)} alt="" width={420} height={560} loading="lazy" decoding="async" />
        <h3>{titill}</h3>
        <p className="goa-ar">{ar}</p>
        <p className="goa-tolur"><b>{fjoldi}</b><span>vörur</span></p>
        <p className="goa-nota">{nota}</p>
        <span className="goa-fra">Skoða vörurnar</span>
      </a>
    </Reveal>
  )
}

export default function GoaPage() {
  useWatchdog()
  useMjukSkrun()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'Góa | Sælgætisgerð síðan 1968'
    document.documentElement.lang = 'is'
    const root = document.querySelector('.goa-root') as HTMLElement | null
    const syncTheme = () => setThemeColor(root?.dataset.tema === 'dokkt' ? C.dokkt : C.pappirHreint)
    syncTheme()
    const mo = root ? new MutationObserver(syncTheme) : null
    mo?.observe(root as HTMLElement, { attributes: true, attributeFilter: ['data-tema'] })
    const hash = window.location.hash
    let hashTimer = 0
    if (hash.length > 1 && document.querySelector(hash)) {
      hashTimer = window.setTimeout(() => {
        const mark = document.querySelector(hash)
        if (!mark) return
        const off = -((document.querySelector('.goa-haus')?.getBoundingClientRect().height ?? 56) + 12)
        const l = (window as unknown as { __goaLenis?: { scrollTo: (t: Element, o?: object) => void } }).__goaLenis
        if (l) l.scrollTo(mark, { offset: off })
        else window.scrollTo({ top: mark.getBoundingClientRect().top + window.scrollY + off })
      }, 260)
    } else {
      window.scrollTo(0, 0)
    }
    return () => {
      window.clearTimeout(hashTimer)
      mo?.disconnect()
      poki.open(false)
      document.title = prevTitle; document.documentElement.lang = prevLang
    }
  }, [])

  return (
    <div className="goa-root">
      <style>{CSS}{PAGE_CSS}{POKA_CSS}{HLEDSLA_CSS}{REGN_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Bendill />
      <Haus />
      <Poki />
      <Hledsla />

      <main>
        {/* hero: the four-line sentence left, seven bags on their own colours right */}
        <section className="goa-hero">
          <Reveal className="goa-heroT">
            <div>
              <Merki>Góa-Linda · Garðahrauni 2, Garðabæ</Merki>
              <h1 className="goa-disp">
                {TEXTI.heroLinur.map((l, i) => (
                  <span className="goa-mask" key={l}>
                    <span className="goa-up goa-lina" style={step(i)}>{l}</span>
                  </span>
                ))}
                <span className="goa-mask">
                  <span className="goa-up goa-lina goa-heroAr" style={step(TEXTI.heroLinur.length)}>
                    {TEXTI.heroAr}
                  </span>
                </span>
              </h1>
            </div>
            <p className="goa-heroSlag goa-mask goa-maskP">
              <span className="goa-up" style={step(TEXTI.heroLinur.length + 2)}>{TEXTI.heroUndir}</span>
            </p>
          </Reveal>
          <Reveal className="goa-rist">
            {HERO_REITIR.map((r, i) => (
              <figure className="goa-reit goa-mask" key={r.img} style={{ '--grunnur': r.grunnur } as CSSProperties}>
                <img className="goa-up" style={step(i)} src={S(r.img)} alt={r.n}
                  width={300} height={400} loading={i < 4 ? 'eager' : 'lazy'} decoding="async" />
              </figure>
            ))}
          </Reveal>
        </section>

        {/* the inline-image sentence, then their own words beneath it */}
        <section className="goa-band">
          <div className="goa-wrap">
            <Reveal>
              <h2 className="goa-disp goa-setning">
                {SETNING.map((lina, li) => (
                  <span className="goa-mask goa-setL" key={li}>
                    <span className="goa-up goa-lina" style={step(li)}>
                      {lina.map((b, i) =>
                        't' in b ? (
                          <span key={i}>{b.t}</span>
                        ) : (
                          <span className="goa-bitiM" key={i}
                            style={{ '--grunnur': b.grunnur, '--b': b.b ?? 1 } as CSSProperties}>
                            <img src={S(b.img)} alt={b.n} width={120} height={106} loading="lazy" decoding="async" />
                          </span>
                        ),
                      )}
                    </span>
                  </span>
                ))}
              </h2>
            </Reveal>
            <Reveal className="goa-mask goa-maskP" style={{ marginTop: 'clamp(2.4rem,5vw,4.4rem)' }}>
              <p className="goa-tilv goa-up">„{TILVITNUN}“</p>
            </Reveal>
          </div>
        </section>

        {/* the bag, emptied */}
        <Nammiregn />

        {/* the four lines */}
        <section className="goa-band" id="vorur">
          <div className="goa-wrap">
            <Merki>Vörurnar</Merki>
            <Ord className="goa-disp" text="Fjórar hillur, | ein sælgætisgerð" />
            <p className="goa-brod goa-mask goa-maskP" style={{ marginTop: '1.4rem', marginBottom: 'var(--band)' }}>
              <span className="goa-up" style={step(2)}>{TEXTI.linurInn}</span>
            </p>
            <div className="goa-linur">
              <Lina n={0} til="#hillan" titill="Góu vörur" ar="Síðan 1968" fjoldi={FJOLDI.goa}
                nota="Hraun, Æði, Prins, Brak, kúlur, karamellur og hlaup."
                grunnur={GRUNNAR.florida} mynd="/goa/floridabitar.webp" />
              <Lina n={1} til="#hillan" titill="Lindu vörur" ar="Frá Akureyri" fjoldi={FJOLDI.linda}
                nota="Buff, Lindor, suðusúkkulaði, appelsínusúkkulaði og stangir."
                grunnur={GRUNNAR.linda} mynd="/goa/lindu-sudusukkuladi.webp" />
              <Lina n={1} til="#hillan" titill="Appolo lakkrís" ar="Lakkrísgerðin" fjoldi={FJOLDI.appolo}
                nota="Rúllur, reimar, kurl, molar og lakkríssúkkulaði."
                grunnur={GRUNNAR.pipar} mynd="/goa/appolo-pipar-hjup.webp" />
              <Lina n={2} til="#erindi" titill="Sælgæti í lausu" ar="1 til 3,5 kg" fjoldi={FJOLDI.lausu}
                nota="Fyrir nammibari, bland í poka og ísbúðir."
                grunnur={GRUNNAR.gull} mynd="/goa/appolo-kurl-lausu.webp" />
            </div>
          </div>
        </section>

        {/* five facts */}
        <section className="goa-band">
          <div className="goa-wrap">
            <Merki>Í tölum</Merki>
            <Reveal className="goa-kostir" style={{ marginTop: '2.4rem' }}>
              {KOSTIR.map((k, i) => (
                <div className="goa-kostur goa-mask" key={k.t}>
                  <div className="goa-up" style={step(i)}>
                    <b>{k.n}</b><strong>{k.t}</strong><p>{k.d}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* the shelf: their catalogue, with case size, product number, ingredient sheet */}
        <section className="goa-band" id="hillan">
          <div className="goa-wrap">
            <Merki>Hillan</Merki>
            <Ord className="goa-disp" text="Beint í | nammipokann" />
            <p className="goa-brod goa-mask goa-maskP" style={{ marginTop: '1.4rem', marginBottom: '2.8rem' }}>
              <span className="goa-up" style={step(2)}>{TEXTI.hillanInn}</span>
            </p>
            <Reveal className="goa-hillan">
              {HILLAN.map((v, i) => (
                <article className="goa-vara goa-mask" key={v.nr} data-bendill="Í pokann"
                  style={{ '--grunnur': v.grunnur } as CSSProperties}>
                  <div className="goa-up goa-vara" style={step(i % 4)}>
                    <figure><img src={S(v.img)} alt={v.n} width={400} height={500} loading="lazy" decoding="async" /></figure>
                    <h3>{v.n}</h3>
                    <dl><dt>Pakkning</dt><dd>{v.pk}</dd><dt>Vörunr.</dt><dd>{v.nr}</dd></dl>
                    <div className="goa-varaF">
                      <SettIPoka v={v} />
                      {v.pdf ? <a href={v.pdf} target="_blank" rel="noopener">Innihald</a> : null}
                    </div>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Easter eggs */}
        <section className="goa-band" id="paskaegg">
          <div className="goa-wrap">
            <Merki>Páskaeggin</Merki>
            <Ord className="goa-disp" text="Nr. 3 upp í nr. 11" />
            <p className="goa-brod goa-mask goa-maskP" style={{ marginTop: '1.4rem', marginBottom: '2.8rem' }}>
              <span className="goa-up" style={step(2)}>{TEXTI.eggInn}</span>
            </p>
            <Reveal className="goa-eggin">
              {EGGIN.map((e, i) => (
                <figure className="goa-egg" key={e.nr} style={{ '--s': e.s ?? 1 } as CSSProperties}>
                  <div className="goa-mask">
                    <img className="goa-up" style={step(i % 4)} src={S(e.img)} alt={e.n}
                      width={320} height={900} loading="lazy" decoding="async" />
                  </div>
                  <figcaption>{e.n}<span>{e.pk} · vörunr. {e.nr}</span></figcaption>
                </figure>
              ))}
            </Reveal>
          </div>
        </section>

        {/* history */}
        <section className="goa-band" id="sagan">
          <div className="goa-wrap">
            <Merki>Sagan</Merki>
            <Ord className="goa-disp" text="Allt úr | einni vél" />
            <p className="goa-brod goa-mask goa-maskP" style={{ marginTop: '1.4rem', marginBottom: '2.6rem' }}>
              <span className="goa-up" style={step(2)}>{TEXTI.sagaInn}</span>
            </p>
            <Reveal className="goa-saga">
              {SAGAN.map((s, i) => (
                <div className="goa-sagaR goa-mask" key={s.ar}>
                  <b className="goa-up" style={step(i)}>{s.ar}</b>
                  <strong className="goa-up" style={step(i)}>{s.titill}</strong>
                  <p className="goa-up" style={step(i)}>{s.texti}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* the errands */}
        <section className="goa-band" id="erindi">
          <div className="goa-wrap">
            <Merki>Erindið</Merki>
            <Ord className="goa-disp" text="Hvert er | erindið?" />
            <p className="goa-brod goa-mask goa-maskP" style={{ marginTop: '1.4rem', marginBottom: '2.6rem' }}>
              <span className="goa-up" style={step(2)}>{TEXTI.erindiInn}</span>
            </p>
            <Reveal className="goa-erindi">
              {ERINDI.map((e, i) => (
                <div className="goa-mask" key={e.nafn}>
                  <div className="goa-up" style={step(i)}>
                    <i>0{i + 1}</i>
                    <b>{e.nafn}</b>
                    <p>{e.nota}</p>
                    <a href={e.hlekkur} onClick={e.hlekkur === '#hillan' ? (ev) => {
                      ev.preventDefault()
                      const mark = document.querySelector('#hillan'); if (!mark) return
                      const off = -((document.querySelector('.goa-haus')?.getBoundingClientRect().height ?? 56) + 12)
                      const l = (window as unknown as { __goaLenis?: { scrollTo: (t: Element, o?: object) => void } }).__goaLenis
                      if (l) l.scrollTo(mark, { offset: off })
                      else window.scrollTo({ top: mark.getBoundingClientRect().top + window.scrollY + off, behavior: 'smooth' })
                    } : undefined}>{e.ord}</a>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* people */}
        <section className="goa-band">
          <div className="goa-wrap">
            <Merki>Fólkið</Merki>
            <p className="goa-brod goa-mask goa-maskP" style={{ marginBottom: '2.4rem' }}>
              <span className="goa-up">{TEXTI.umInn}</span>
            </p>
            <Reveal className="goa-teymi">
              {TEYMI.map((t, i) => (
                <div className="goa-mask" key={t.nafn}>
                  <div className="goa-up" style={step(i)}>
                    <b>{t.nafn}</b><span>{t.hlutverk}</span>
                    {t.netfang ? <a href={`mailto:${t.netfang}`}>{t.netfang}</a> : null}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* opening hours */}
        <section className="goa-band" id="opnun">
          <div className="goa-wrap">
            <Merki>Lakkríssalan</Merki>
            <Ord className="goa-disp" text="Garðahrauni 2, | Garðabæ" />
            <Reveal className="goa-opnun" style={{ marginTop: '2.4rem' }}>
              {OPNUN.map((s, i) => (
                <div className="goa-mask" key={s.leid}>
                  <div className="goa-up" style={step(i)}>
                    <b>{s.leid}</b><em>{s.verd}</em><p>{s.nota}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <footer className="goa-fotur">
          <div className="goa-wrap">
            {/* the crest as the statement: their own mark, traced to vector
                from the logo pack on goa.is, as big as the page allows */}
            <Reveal className="goa-mask goa-foturM">
              <img className="goa-up" src={S('/goa/goa-merki-stort.svg')} alt="Góa, stofnað 1968"
                width={184} height={230} loading="lazy" decoding="async" />
            </Reveal>
            <div className="goa-foturRod">
              <div>{FYRIRTAEKI.logadi}<br />{FYRIRTAEKI.heimili}<br />Kt. {FYRIRTAEKI.kt}</div>
              <div>
                <a href={FYRIRTAEKI.simiHref}>{FYRIRTAEKI.simi}</a><br />
                <a href={`mailto:${FYRIRTAEKI.netfang}`}>{FYRIRTAEKI.netfang}</a><br />
                <a href={`mailto:${FYRIRTAEKI.pantanir}`}>{FYRIRTAEKI.pantanir}</a>
              </div>
              <div>
                <a href={FYRIRTAEKI.facebook} target="_blank" rel="noopener">Facebook</a><br />
                <a href="https://goa.is/uploads/Goa-logo.zip">Góa merkjapakki</a><br />
                <a href="https://goa.is/uploads/Linda-logo.zip">Linda merkjapakki</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
