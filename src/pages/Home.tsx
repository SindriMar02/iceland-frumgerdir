import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, GitCompareArrows, LineChart, MapPin } from 'lucide-react'
import { SHOWCASE, SHOWCASE_ITEMS } from '../data/showcase'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { markGalleryVisit, setThemeColor } from '../lib/preview'

/** Internal tools (dashboard link, preview send-button) only for Sindri via ?tools. */
function toolsEnabled(): boolean {
  try {
    return new URLSearchParams(window.location.search).has('tools')
  } catch {
    return false
  }
}

const VALUE = [
  'Sterkari fyrsta sýn',
  'Skýrari upplýsingar',
  'Betri upplifun í síma',
  'Einfaldara bókunar- og kaupferli',
]

export default function Home() {
  const showTools = toolsEnabled()

  useEffect(() => {
    document.title = 'Endurhannanir — vefsíður fyrir íslensk fyrirtæki'
    setThemeColor('#0b0e13')
    // Only arm internal preview tooling on Sindri's own ?tools entry — owners
    // opening this hub directly must never see the outreach controls.
    if (showTools) markGalleryVisit()
  }, [showTools])

  let n = 0

  return (
    <div className="grain min-h-screen bg-[#0b0e13] font-sans text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0e13]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-grotesk text-sm font-semibold tracking-tight text-white">
            Sindri Már <span className="text-white/40">— Vefhönnun</span>
          </a>
          <nav className="flex items-center gap-1 sm:gap-2" aria-label="Aðalvalmynd">
            <a href="#verkefni" className="hidden rounded-full px-3.5 py-2 text-sm text-white/70 transition-colors hover:text-white sm:inline">
              Verkefni
            </a>
            <Link to="/preview/comparison" className="hidden rounded-full px-3.5 py-2 text-sm text-white/70 transition-colors hover:text-white sm:inline">
              Fyrir & eftir
            </Link>
            <a
              href="mailto:sindrimar02@gmail.com?subject=Fyrirspurn%20um%20vefs%C3%AD%C3%B0u"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0b0e13] transition-colors hover:bg-white/85"
            >
              Hafa samband
            </a>
          </nav>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Hero */}
        <section className="pt-16 pb-14 md:pt-24 md:pb-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <p className="font-grotesk text-[11px] font-semibold tracking-[0.34em] text-sky-300/80 uppercase">
              Safn endurhannana · 2026
            </p>
            <h1 className="mt-5 max-w-3xl font-tall text-[2.9rem] leading-[1.06] font-light text-balance md:text-7xl">
              Nýjar vefsíður fyrir <em className="text-sky-200 italic">íslensk fyrirtæki</em>.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
              Hér er safn hugmynda að nýjum vefsíðum fyrir íslensk fyrirtæki. Hver síða sýnir hvernig
              fyrirtækið gæti litið út á netinu, með áherslu á sterkari fyrstu sýn, skýrari upplýsingar
              og einfaldari leið fyrir viðskiptavini.
            </p>

            <ul className="mt-8 flex flex-wrap gap-2.5">
              {VALUE.map((v) => (
                <li key={v} className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-sm text-white/75">
                  {v}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-white/55">
              <a href="#verkefni" className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-sky-200">
                Skoða verkefnin
              </a>
              <span className="inline-flex items-center gap-2">
                <span className="font-grotesk text-base font-semibold text-white">{SHOWCASE_ITEMS.length}</span> verkefni
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="font-grotesk text-base font-semibold text-white">{SHOWCASE.length}</span> flokkar
              </span>
            </div>
          </motion.div>
        </section>

        {/* Project groups */}
        <section id="verkefni" className="scroll-mt-20 border-t border-white/10 pt-14 md:pt-20">
          {SHOWCASE.map((group) => (
            <div key={group.id} className="mb-16 md:mb-24">
              <Reveal>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <h2 className="font-tall text-3xl font-light md:text-4xl">{group.title}</h2>
                  <p className="max-w-md text-sm leading-relaxed text-white/50">{group.blurb}</p>
                </div>
              </Reveal>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {group.items.map((item, i) => {
                  n += 1
                  const num = String(n).padStart(2, '0')
                  return (
                    <Reveal key={item.route} delay={i * 0.05}>
                      <Link
                        to={item.route}
                        className="group relative block overflow-hidden rounded-[1.75rem] border border-white/10 transition-colors hover:border-white/25"
                        aria-label={`Skoða frumgerð: ${item.name}`}
                      >
                        <Img
                          src={item.image}
                          alt={`${item.name} — ${item.sector}`}
                          className="aspect-[16/11] w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                          fallbackClassName="aspect-[16/11] w-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#06080c] via-[#06080c]/45 to-[#06080c]/5" aria-hidden="true" />
                        {/* accent line on hover */}
                        <span
                          className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                          style={{ background: item.accent }}
                          aria-hidden="true"
                        />
                        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-7">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-grotesk text-[11px] text-white/45">{num}</span>
                              <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold tracking-[0.04em] text-white backdrop-blur-md">
                                {item.sector}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[11px] text-white/55">
                                <MapPin className="h-3 w-3" aria-hidden="true" />
                                {item.location}
                              </span>
                            </div>
                            <h3 className="mt-3 font-tall text-2xl font-light md:text-3xl">{item.name}</h3>
                            <p className="mt-1.5 max-w-md text-sm leading-relaxed text-white/65">{item.blurb}</p>
                            <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/80">
                              Skoða frumgerð
                              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  )
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Before & after CTA */}
        <Reveal>
          <Link
            to="/preview/comparison"
            className="group flex items-center justify-between gap-4 rounded-[1.75rem] border border-white/12 bg-white/[0.04] p-6 transition-colors hover:border-white/30 md:p-8"
          >
            <div className="flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-400/15 text-sky-300">
                <GitCompareArrows className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="font-tall text-2xl font-light text-white">Fyrir og eftir</h2>
                <p className="mt-1 max-w-md text-sm text-white/55">
                  Berðu saman núverandi vefsíður og frumgerðirnar hlið við hlið.
                </p>
              </div>
            </div>
            <span className="hidden shrink-0 rounded-full border border-white/20 p-3 transition-all duration-300 group-hover:rotate-45 group-hover:border-sky-300 group-hover:bg-sky-300 group-hover:text-slate-950 sm:block">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </Link>
        </Reveal>

        {/* Internal dashboard — Sindri only (?tools) */}
        {showTools && (
          <Reveal className="mt-6">
            <Link
              to="/admin/previews"
              className="group flex items-center justify-between gap-4 rounded-[1.75rem] border border-sky-400/25 bg-sky-400/[0.06] p-6 transition-colors hover:border-sky-400/50 md:p-8"
            >
              <div className="flex items-center gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sky-400/15 text-sky-300">
                  <LineChart className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-grotesk text-[11px] font-semibold tracking-[0.2em] text-sky-300/80 uppercase">
                    Internal · ?tools
                  </p>
                  <h2 className="mt-1 font-tall text-2xl font-light text-white">Verkefnayfirlit</h2>
                  <p className="mt-1 max-w-md text-sm text-white/55">Innra mælaborð með úttektum og útsendingu frumgerða.</p>
                </div>
              </div>
              <span className="hidden shrink-0 rounded-full border border-white/20 p-3 transition-all duration-300 group-hover:rotate-45 group-hover:border-sky-300 group-hover:bg-sky-300 group-hover:text-slate-950 sm:block">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </Link>
          </Reveal>
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-white/10 py-12 text-center md:mt-24">
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/55">
            <strong className="text-white/80">Frumgerðir — hönnunarhugmyndir.</strong> Þetta eru
            hugmyndir að nýjum vefsíðum, ekki raunverulegar vefsíður fyrirtækjanna. Texti, verð og
            umsagnir eru sýnishorn. Myndir frá Unsplash.
          </p>
          <p className="mt-4 text-xs text-white/35">
            Hugmynd og hönnun · {' '}
            <a href="mailto:sindrimar02@gmail.com" className="underline underline-offset-2 hover:text-white/60">
              sindrimar02@gmail.com
            </a>
          </p>
        </footer>
      </main>
    </div>
  )
}
