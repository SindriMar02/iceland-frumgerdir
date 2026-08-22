import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import {
  CONTACT, JSON_LD, SERVICE_PAGES, TESTIMONIALS, srcSet,
} from './data'
import {
  BackLink, ClFoot, ClNav, CursorRing, Headline, ROUTE, Rule, SHARED_CSS,
  buildEntrance, createLenis, createRevealSweep, fluid, openingPlayed, reduced,
} from './shared'
import type { SmoothScroller } from './shared'

gsap.registerPlugin(ScrollTrigger)

const company = getPreviewCompany('chrislund')

/* ── FRÁ TÖKU AÐ PRENTI — the three service pages ───────────────────────────
   One template, three real pages mirroring his own site's service pages
   (/prentun-tilbod, /copy-of-litgreining, /myndvinnsla). Every printer,
   scanner, film format, book title and quote is his own published copy. The
   register on the litgreining page (Kjarval, Mikines, RAX...) is the honest
   numbers device: his actual client list, no invention needed. */

function useServiceMotion(ready: boolean, root: React.RefObject<HTMLDivElement | null>, play: boolean) {
  useEffect(() => {
    if (!ready) return
    const el = root.current
    if (!el) return
    if (reduced()) {
      el.classList.add('cl-static')
      el.classList.remove('cl-pre')
      return
    }
    el.classList.add('cl-js')

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('is-in')),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' },
    )
    el.querySelectorAll('.cl-rv').forEach((n) => {
      if (n.getBoundingClientRect().top < window.innerHeight) n.classList.add('is-in')
      io.observe(n)
    })

    const ctx = gsap.context(() => {
      if (play) buildEntrance(el)
      else el.classList.remove('cl-pre')
      el.querySelectorAll<HTMLElement>('[data-cl-headline]').forEach((h) => {
        /* the page title belongs to the opening timeline */
        if (h.dataset.clEnter === 'word') return
        const words = h.querySelectorAll<HTMLElement>('.cl-word')
        if (!words.length) return
        gsap.fromTo(words,
          { yPercent: 116, opacity: 0 },
          {
            yPercent: 0, opacity: 1, duration: 1.05, ease: 'expo.out', stagger: 0.07,
            scrollTrigger: { trigger: h, start: 'top 88%', once: true },
          })
      })
    }, el)

    const revealSweep = createRevealSweep(el)
    const sweep = () => { ScrollTrigger.update(); revealSweep.tick() }
    window.addEventListener('scroll', sweep, { passive: true })

    let lenis: SmoothScroller | null = null
    let tick: ((t: number) => void) | null = null
    let disposed = false
    createLenis().then((l) => {
      if (!l) return
      if (disposed) { l.destroy(); return }
      lenis = l
      l.on('scroll', sweep)
      tick = (t: number) => { l.raf(t * 1000) }
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
    })

    return () => {
      disposed = true
      io.disconnect()
      if (tick) gsap.ticker.remove(tick)
      window.removeEventListener('scroll', sweep)
      ctx.revert()
      lenis?.destroy()
    }
  }, [ready, root, play])
}

export default function ChrisLundServicePage({ slug }: { slug: string }) {
  const page = SERVICE_PAGES.find((p) => p.slug === slug) ?? SERVICE_PAGES[0]
  const [ready, setReady] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  /* the holding class must be on the first painted frame, never set in an effect */
  const playRef = useRef(!reduced() && !openingPlayed())
  const holdRef = playRef

  useEffect(() => {
    setThemeColor('#F5F4F1')
    document.title = `${page.name} · Christopher Lund`
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDescription = meta.content
    meta.content = `${page.name} hjá Christopher Lund ljósmyndara: ${page.intro.slice(0, 130)}`
    const prevLang = document.documentElement.lang
    document.documentElement.lang = 'is'
    setReady(true)
    return () => {
      meta.content = prevDescription
      document.documentElement.lang = prevLang
    }
  }, [page])

  useServiceMotion(ready, rootRef, playRef.current)

  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug)

  return (
    <div ref={rootRef} className={`cl-root ${holdRef.current ? 'cl-pre' : ''}`}>
      <style>{SHARED_CSS + CSS}</style>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <PreviewChrome company={company} />
      <CursorRing />
      <ClNav home={false} tone="ink" />

      <main>
      {/* header */}
      <section className="cl-sv-head">
        <div className="cl-sv-back">
          <BackLink fallback={`${ROUTE}#thjonusta`} label="Til baka" />
        </div>
        <p className="cl-sv-kicker" data-cl-enter="item">Frá töku að prenti · {page.nr} af {String(SERVICE_PAGES.length).padStart(2, '0')}</p>
        <Headline as="h1" text={page.title} size={96} floor={36} measure={880} enter />
        <p className="cl-body cl-sv-intro" data-cl-enter="item">{page.intro}</p>
      </section>

      {/* the craft: photos + facts side by side */}
      <section className="cl-sv-craft">
        <div className={`cl-sv-figs ${page.photos.length > 1 ? 'is-two' : ''}`}>
          {page.photos.map((p, i) => (
            <figure key={i} className="cl-sv-fig cl-rv">
              <img src={p.photo.src} srcSet={srcSet(p.photo.src)}
                sizes={page.photos.length > 1 ? '(max-width: 991px) 46vw, 22vw' : '(max-width: 991px) 92vw, 42vw'}
                style={{ aspectRatio: p.photo.ratio }}
                alt={p.photo.alt} loading="lazy" decoding="async" />
              <figcaption className="cl-fig-cap">{p.cap}</figcaption>
            </figure>
          ))}
        </div>
        <div className="cl-sv-side">
          <Rule label="Tækin og aðferðin" />
          <dl className="cl-sv-facts">
            {page.facts.map(([k, v]) => (
              <div key={k} className="cl-rv"><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
          {page.blocks.map((b) => (
            <div key={b.h} className="cl-sv-block cl-rv">
              <h2 className="cl-sv-block-h">{b.h}</h2>
              {b.body.map((t, i) => <p key={i} className="cl-body cl-sv-block-p">{t}</p>)}
            </div>
          ))}
        </div>
      </section>

      {/* the process, only where his own copy describes one */}
      {page.steps && (
        <section className="cl-sv-steps" aria-label="Ferlið">
          <Rule label="Svona gengur það fyrir sig" />
          <ol className="cl-sv-steps-list">
            {page.steps.map((s, i) => (
              <li key={s.h} className="cl-rv">
                <span className="cl-sv-step-nr">{i + 1}</span>
                <span className="cl-sv-step-h">{s.h}</span>
                <span className="cl-sv-step-b">{s.b}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* the register: his actual book credits, no invention needed */}
      {page.register && (
        <section className="cl-sv-reg" aria-label={page.register.h}>
          <Rule label={page.register.h} />
          <p className="cl-body cl-rv">{page.register.note}</p>
          <ul className="cl-sv-reg-list">
            {page.register.items.map((it) => (
              <li key={it.name} className="cl-rv">
                <span className="cl-sv-reg-name">{it.name}</span>
                <span className="cl-sv-reg-note">{it.note}</span>
              </li>
            ))}
          </ul>
          <p className="cl-sv-reg-foot cl-rv">{page.register.foot}</p>
        </section>
      )}

      {/* what the clients say, verbatim from his umsagnir page */}
      <section className="cl-sv-quotes" aria-label="Umsagnir">
        {page.quotes.map((key) => {
          const t = TESTIMONIALS[key]
          return (
            <blockquote key={key} className="cl-sv-quote cl-rv">
              <p>„{t.quote}“</p>
              <footer>{t.name}, {t.org}</footer>
            </blockquote>
          )
        })}
      </section>

      {/* close: call, then the two sibling doors */}
      <section className="cl-sv-close">
        <Headline text="Sendu myndirnar eða hringdu." size={72} floor={30} measure={760} />
        <a className="cl-sv-close-tel cl-rv" href={CONTACT.phoneHref}>{CONTACT.phone}</a>
        <p className="cl-sv-close-addr cl-rv">{CONTACT.address}</p>
        <div className="cl-sv-others cl-rv">
          <span className="cl-sv-others-label">Önnur þjónusta</span>
          {others.map((p) => (
            <Link key={p.slug} className="cl-sv-other" to={`${ROUTE}/${p.slug}`}>{p.name} &rarr;</Link>
          ))}
        </div>
      </section>

      <ClFoot />
      </main>

      <PreviewFooter company={company} />
    </div>
  )
}

const CSS = `
.cl-sv-head { padding: calc(var(--u) * 130) calc(var(--u) * 34) calc(var(--u) * 40); }
.cl-sv-back { margin-bottom: calc(var(--u) * 40); }
.cl-sv-kicker { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12, 12)}; letter-spacing: .16em; text-transform: uppercase; color: var(--cl-gold-text); margin: 0 0 calc(var(--u) * 20); }
.cl-sv-intro { max-width: 62ch; font-size: ${fluid(19, 16)}; }

.cl-sv-craft {
  display: grid; grid-template-columns: 1fr 1.05fr; gap: calc(var(--u) * 80);
  align-items: start; padding: calc(var(--u) * 60) calc(var(--u) * 34) calc(var(--u) * 110);
}
.cl-sv-figs { display: grid; gap: calc(var(--u) * 44); align-content: start; }
/* Two photographs sit SIDE BY SIDE, not stacked. Stacked, two portraits in
   this column ran 1653px tall against a 557px column of specs beside them,
   which read as an empty page. The slight drop on the second keeps the pair
   from looking like a rigid diptych. */
.cl-sv-figs.is-two { grid-template-columns: 1fr 1fr; gap: calc(var(--u) * 26); align-items: start; }
.cl-sv-figs.is-two .cl-sv-fig:nth-child(2) { margin-top: calc(var(--u) * 40); }
.cl-sv-fig { margin: 0; }
.cl-sv-fig img { width: 100%; height: auto; object-fit: cover; display: block; }
.cl-sv-facts { margin: 0 0 calc(var(--u) * 44); }
.cl-sv-facts div { display: grid; grid-template-columns: minmax(120px, 32%) 1fr; gap: 18px; padding: 13px 0; border-top: 1px solid var(--cl-hair); }
.cl-sv-facts dt { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(11.5, 11.5)}; letter-spacing: .13em; text-transform: uppercase; color: var(--cl-mute); padding-top: 2px; }
.cl-sv-facts dd { margin: 0; font-size: ${fluid(15.5, 14)}; line-height: 1.55; }
.cl-sv-block { margin-top: calc(var(--u) * 36); }
.cl-sv-block-h { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(26, 19)}; margin: 0 0 calc(var(--u) * 14); }
.cl-sv-block-p { margin-bottom: calc(var(--u) * 14); }

.cl-sv-steps { padding: 0 calc(var(--u) * 34) calc(var(--u) * 110); }
.cl-sv-steps-list { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: calc(var(--u) * 44); }
.cl-sv-steps-list li { display: grid; gap: 8px; align-content: start; padding-top: 16px; border-top: 1px solid var(--cl-hair); }
.cl-sv-step-nr { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(44, 28)}; line-height: 1; color: var(--cl-gold-text); font-variant-numeric: tabular-nums; }
.cl-sv-step-h { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(21, 17)}; }
.cl-sv-step-b { font-size: ${fluid(14.5, 13)}; line-height: 1.6; color: var(--cl-mute); }

.cl-sv-reg { background: #ECEAE4; padding: calc(var(--u) * 110) calc(var(--u) * 34); }
.cl-sv-reg-list { list-style: none; margin: calc(var(--u) * 40) 0 0; padding: 0; }
.cl-sv-reg-list li { display: flex; align-items: baseline; justify-content: space-between; gap: 18px; padding: 14px 0; border-top: 1px solid var(--cl-hair); }
.cl-sv-reg-name { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(34, 21)}; letter-spacing: -.01em; }
.cl-sv-reg-note { flex: none; font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(11.5, 11.5)}; letter-spacing: .13em; text-transform: uppercase; color: var(--cl-mute); }
.cl-sv-reg-foot { max-width: 68ch; margin: calc(var(--u) * 36) 0 0; font-size: ${fluid(14.5, 13)}; line-height: 1.65; color: var(--cl-mute); }

.cl-sv-quotes { padding: calc(var(--u) * 110) calc(var(--u) * 34) calc(var(--u) * 40); display: grid; gap: calc(var(--u) * 70); }
.cl-sv-quote { margin: 0 auto; max-width: calc(var(--u) * 880); text-align: center; }
.cl-sv-quote p { font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(30, 19)}; line-height: 1.34; letter-spacing: -.01em; margin: 0 0 calc(var(--u) * 20); }
.cl-sv-quote footer { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(12.5, 12)}; letter-spacing: .14em; text-transform: uppercase; color: var(--cl-mute); }

.cl-sv-close { text-align: center; padding: calc(var(--u) * 110) calc(var(--u) * 34) calc(var(--u) * 120); }
.cl-sv-close .cl-headline { margin-inline: auto; }
.cl-sv-close-tel {
  display: inline-block; font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(96, 42)};
  letter-spacing: -.02em; color: inherit; text-decoration: none; margin-top: calc(var(--u) * 14);
  transition: color .3s cubic-bezier(.16,1,.3,1); font-variant-numeric: tabular-nums;
}
.cl-sv-close-tel:hover { color: var(--cl-gold-text); }
.cl-sv-close-addr { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(13, 12.5)}; color: var(--cl-mute); margin-top: calc(var(--u) * 18); }
.cl-sv-others { display: flex; justify-content: center; align-items: baseline; gap: calc(var(--u) * 36); flex-wrap: wrap; margin-top: calc(var(--u) * 54); }
.cl-sv-others-label { font-family: 'Space Mono', ui-monospace, monospace; font-size: ${fluid(11.5, 11.5)}; letter-spacing: .16em; text-transform: uppercase; color: var(--cl-mute); }
.cl-sv-other {
  font-family: 'Cabinet Grotesk', system-ui, sans-serif; font-weight: 500; font-size: ${fluid(19, 16)};
  color: var(--cl-ink); text-decoration: none; border-bottom: 1px solid var(--cl-hair); padding-bottom: 2px;
  transition: color .3s cubic-bezier(.16,1,.3,1), border-color .3s;
}
.cl-sv-other:hover { color: var(--cl-gold-text); border-color: currentColor; }

@media (max-width: 991px) {
  .cl-sv-craft { grid-template-columns: 1fr; gap: calc(var(--u) * 44); }
  .cl-sv-figs.is-two .cl-sv-fig:nth-child(2) { margin-top: 0; }
  .cl-sv-steps-list { grid-template-columns: 1fr; gap: 26px; }
}
@media (max-width: 640px) {
  .cl-sv-head, .cl-sv-craft, .cl-sv-steps, .cl-sv-reg, .cl-sv-quotes, .cl-sv-close { padding-left: 20px; padding-right: 20px; }
  .cl-sv-head { padding-top: calc(var(--u) * 150); }
}
`
