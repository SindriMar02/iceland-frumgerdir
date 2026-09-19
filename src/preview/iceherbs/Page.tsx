import { useEffect } from 'react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import { Bendill, C, CSS, Haus, Hvild, Intro, Merki, Ord, Reveal, Stem, step, useWatchdog } from './ui'
import { BAETIEFNI, HUDVORUR, MIXTURUR, PAKKAR, GREINAR, kr, type Vara } from './products'
import {
  FYRIRTAEKI, JSON_LD, KOSTIR, SAGAN, SENDING, SOLUSTADIR, TEXTI, TEYMI, TILVITNUN,
} from './data'

const company = getPreviewCompany('iceherbs')

const PAGE_CSS = `
.ih-hero{min-height:100svh;display:flex;flex-direction:column;justify-content:flex-end;
  padding:calc(var(--band) / 1.4) 0 var(--band);position:relative}
/* on a phone the 100svh hero left a screenful of dead space above the copy,
   because the content is bottom-aligned. Let it size to its content instead. */
@media (max-width:760px){.ih-hero{min-height:auto;justify-content:flex-start;
  padding:calc(var(--band) / 1.1) 0 var(--band)}}
.ih-heroRod{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:var(--col);align-items:end}
@media (max-width:900px){.ih-heroRod{grid-template-columns:1fr;gap:2.2rem}}
.ih-heroAr{font-variant-numeric:tabular-nums;color:var(--c-mosi)}
.ih-rist{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col)}
.ih-rist figure{margin:0;background:#fff;aspect-ratio:1;display:grid;place-items:center;padding:12%}

.ih-tilv{max-width:34ch;font-size:clamp(1.3rem,2.4vw,2.1rem);line-height:1.22;letter-spacing:-.02em;
  font-weight:500;margin:0}

.ih-linur{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--band) var(--col)}
@media (max-width:760px){.ih-linur{grid-template-columns:1fr;gap:3rem}}
.ih-lina-h{display:flex;align-items:baseline;justify-content:space-between;gap:1rem;
  padding-bottom:.7rem;box-shadow:inset 0 -1px 0 var(--c-lina)}
.ih-vorur{list-style:none;margin:1.1rem 0 0;padding:0;display:grid;gap:.1rem}
.ih-vara{display:grid;grid-template-columns:44px 1fr auto;gap:.9rem;align-items:center;
  padding:.62rem 0;box-shadow:inset 0 -1px 0 var(--c-lina);
  transition:background .3s var(--ease)}
.ih-vara img{width:44px;height:44px;object-fit:contain;background:#fff;padding:3px}
.ih-vara span{font-size:.94rem;line-height:1.3}
@media (hover:hover) and (pointer:fine){.ih-vara:hover{background:var(--c-flotur)}}

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
.ih-pakki{background:var(--c-flotur);padding:1rem;display:flex;flex-direction:column;gap:.7rem;
  transition:transform .4s var(--ease)}
.ih-pakki figure{margin:0;aspect-ratio:1;display:grid;place-items:center;background:#fff}
.ih-pakki img{max-height:100%}
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
.ih-teymi div{padding-top:.7rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-teymi b{display:block;font-weight:500}
.ih-teymi span{font-size:.85rem;opacity:.72}

.ih-solu{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col)}
@media (max-width:760px){.ih-solu{grid-template-columns:1fr;gap:1.1rem}}
.ih-solu div{padding-top:.8rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-solu b{display:block;font-size:1.15rem;font-weight:500;margin-bottom:.3rem}
.ih-solu p{margin:0;font-size:.88rem;opacity:.78;line-height:1.45}

.ih-greinar{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col)}
@media (max-width:900px){.ih-greinar{grid-template-columns:1fr;gap:1.2rem}}
.ih-grein{padding-top:.8rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-grein time{font-size:.8rem;font-variant-numeric:tabular-nums;opacity:.65}
.ih-grein h3{margin:.4rem 0 0;font-size:1.02rem;font-weight:500;line-height:1.3}

.ih-sending{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--col)}
@media (max-width:760px){.ih-sending{grid-template-columns:1fr;gap:1.1rem}}
.ih-sending div{padding-top:.8rem;box-shadow:inset 0 1px 0 var(--c-lina)}
.ih-sending b{display:block;font-weight:500}
.ih-sending em{font-style:normal;font-variant-numeric:tabular-nums;color:var(--c-mosi);font-weight:500}
.ih-sending p{margin:.3rem 0 0;font-size:.86rem;opacity:.78;line-height:1.45}

.ih-fotur{padding:var(--band) 0 2.5rem;background:var(--c-mosi);color:var(--c-bg)}
.ih-fotur .ih-slag{font-size:clamp(2.4rem,11vw,9rem);font-weight:600;letter-spacing:-.045em;
  line-height:.9;margin:0 0 var(--band)}
.ih-foturRod{display:flex;flex-wrap:wrap;gap:1.4rem var(--col);justify-content:space-between;
  font-size:.86rem;line-height:1.6}
.ih-fotur a{text-decoration:underline;text-underline-offset:3px;display:inline-block;padding:.45rem 0;min-height:32px}
`

function VoruLina({ titill, nota, vorur, n }: { titill: string; nota: string; vorur: Vara[]; n: number }) {
  return (
    <Reveal className="ih-mask">
      <div className="ih-up" style={step(n)}>
        <div className="ih-lina-h">
          <h3 className="ih-mid">{titill}</h3>
          <span className="ih-verd" style={{ opacity: 0.7 }}>{vorur.length}</span>
        </div>
        <p className="ih-brod" style={{ marginTop: '.7rem', fontSize: '.92rem', opacity: 0.8 }}>{nota}</p>
        <ul className="ih-vorur">
          {vorur.map((v) => (
            <li className="ih-vara" key={v.n} data-bendill="Skoða">
              {v.img ? <img src={v.img} alt="" width={44} height={44} loading="lazy" decoding="async" /> : <span />}
              <span>{v.n}</span>
              <span className="ih-verd">{kr(v.v)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  )
}

export default function IceherbsPage() {
  useWatchdog()
  useEffect(() => {
    const prevTitle = document.title
    const prevLang = document.documentElement.lang
    document.title = 'ICEHERBS | Úr sama grasi síðan 1993'
    document.documentElement.lang = 'is'
    setThemeColor(C.pappirHreint)
    window.scrollTo(0, 0)
    return () => { document.title = prevTitle; document.documentElement.lang = prevLang }
  }, [])

  const hero = [...MIXTURUR.slice(0, 3), ...BAETIEFNI.slice(0, 3)].filter((v) => v.img)

  return (
    <div className="ih-root">
      <style>{CSS}{PAGE_CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <Intro />
      <Bendill />
      <Haus />
      <Hvild mynd={MIXTURUR[0]?.img ?? ''} />

      <main>
        {/* hero ------------------------------------------------- */}
        <section className="ih-band ih-hero">
          <Stem />
          <div className="ih-wrap ih-inn">
            <Reveal className="ih-heroRod">
              <div>
                <Merki>Kavita ehf. · Kópavogur og Blönduós</Merki>
                <h1 className="ih-disp">
                  <span className="ih-mask"><span className="ih-up ih-lina">{TEXTI.heroYfir}</span></span>
                  <span className="ih-mask"><span className="ih-up ih-lina ih-heroAr" style={step(1)}>{TEXTI.heroAr}</span></span>
                </h1>
                <p className="ih-brod ih-mask" style={{ marginTop: '1.6rem' }}>
                  <span className="ih-up" style={step(3)}>{TEXTI.heroUndir}</span>
                </p>
              </div>
              <Reveal className="ih-rist">
                {hero.map((v, i) => (
                  <figure key={v.n} className="ih-mask">
                    <img className="ih-up" style={step(i)} src={v.img ?? ''} alt={v.n}
                      width={300} height={300} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" />
                  </figure>
                ))}
              </Reveal>
            </Reveal>
          </div>
        </section>

        {/* pull quote, their own words -------------------------- */}
        <section className="ih-band">
          <Stem />
          <div className="ih-wrap ih-inn">
            <Reveal className="ih-mask">
              <p className="ih-tilv ih-up">{TILVITNUN}</p>
            </Reveal>
          </div>
        </section>

        {/* the four lines --------------------------------------- */}
        <section className="ih-band">
          <Stem />
          <div className="ih-wrap ih-inn">
            <Merki>Vörurnar</Merki>
            <Ord className="ih-disp" text={'Fjórar línur,' + ' | ' + 'eitt hráefni'} />
            <p className="ih-brod ih-mask" style={{ marginTop: '1.4rem', marginBottom: 'var(--band)' }}>
              <span className="ih-up" style={step(2)}>{TEXTI.familiurInn}</span>
            </p>
            <div className="ih-linur">
              <VoruLina n={0} titill="Mixtúrur" nota="Í sölu samfellt síðan 1995." vorur={MIXTURUR} />
              <VoruLina n={1} titill="Húðvörur" nota="ICEHERBS SKIN, frá 2017." vorur={HUDVORUR} />
              <VoruLina n={0} titill="Bætiefni" nota="Hylki, í framleiðslu frá 2012." vorur={BAETIEFNI} />
              <VoruLina n={1} titill="Tilboðspakkar" nota="Settir saman eftir líðan, ekki vöruflokki." vorur={PAKKAR.slice(0, 10)} />
            </div>
          </div>
        </section>

        {/* five facts ------------------------------------------- */}
        <section className="ih-band">
          <Stem />
          <div className="ih-wrap ih-inn">
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
        <section className="ih-band">
          <Stem />
          <div className="ih-wrap ih-inn">
            <Merki>Pakkar</Merki>
            <Ord className="ih-disp" text="Eftir líðan, | ekki vöruflokki" />
            <p className="ih-brod ih-mask" style={{ marginTop: '1.4rem', marginBottom: '2.6rem' }}>
              <span className="ih-up" style={step(2)}>{TEXTI.pakkarInn}</span>
            </p>
            <Reveal className="ih-pakkar">
              {PAKKAR.slice(0, 8).map((p, i) => (
                <article className="ih-pakki ih-mask" key={p.n} data-bendill="Skoða">
                  <div className="ih-up" style={step(i % 4)}>
                    <figure>{p.img ? <img src={p.img} alt={p.n} width={300} height={300} loading="lazy" decoding="async" /> : null}</figure>
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
        <section className="ih-band">
          <Stem />
          <div className="ih-wrap ih-inn">
            <Merki>ICEHERBS SKIN</Merki>
            <p className="ih-brod ih-mask" style={{ marginBottom: '2.4rem' }}>
              <span className="ih-up">{TEXTI.hudInn}</span>
            </p>
            <Reveal className="ih-hud">
              {HUDVORUR.slice(0, 4).map((h, i) => (
                <figure key={h.n} style={{ margin: 0 }}>
                  <div className="ih-mask">
                    <figure className="ih-up" style={step(i)}>
                      {h.img ? <img src={h.img} alt={h.n} width={400} height={500} loading="lazy" decoding="async" /> : null}
                    </figure>
                  </div>
                  <figcaption>{h.n}<br /><span className="ih-verd">{kr(h.v)}</span></figcaption>
                </figure>
              ))}
            </Reveal>
          </div>
        </section>

        {/* history ---------------------------------------------- */}
        <section className="ih-band">
          <Stem />
          <div className="ih-wrap ih-inn">
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
          <Stem />
          <div className="ih-wrap ih-inn">
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
        <section className="ih-band">
          <Stem />
          <div className="ih-wrap ih-inn">
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
        <section className="ih-band">
          <Stem />
          <div className="ih-wrap ih-inn">
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
          <Stem />
          <div className="ih-wrap ih-inn">
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
          <div className="ih-wrap ih-inn">
            <Reveal className="ih-mask">
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
