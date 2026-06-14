import { useEffect, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Clock,
  Leaf,
  MapPin,
  Phone,
  ShoppingBag,
} from 'lucide-react'
import { getPreviewCompany } from '../companies'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { Img } from '../../components/Img'
import { DYES, HERO_ID, MARKS, YARNS, photo } from './data'

const company = getPreviewCompany('hespa')

const Q = '&auto=format&fit=crop'
const HERO = `https://images.unsplash.com/${HERO_ID}`

const EASE = [0.22, 1, 0.36, 1] as const

/* ── Small in-house motion components (no shared Reveal) ─────────── */

function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/** A thin colour rule that "draws in" from the left as it enters view. */
function DyeRule({ color }: { color: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className="block h-px origin-left"
      style={{ background: color }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: EASE }}
    />
  )
}

export default function Page() {
  // The signature: which natural-dye colour is currently selected.
  const [active, setActive] = useState(DYES[0].id)
  const dye = DYES.find((d) => d.id === active) ?? DYES[0]
  const filtered = YARNS.filter((y) => y.colour === active)

  useEffect(() => {
    document.title = 'Hespa — Litir landsins (hugmynd)'
  }, [])

  // Roving keyboard nav across the swatch row.
  const onSwatchKey = (e: ReactKeyboardEvent<HTMLButtonElement>, i: number) => {
    let next: number
    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        next = (i + 1 + DYES.length) % DYES.length
        break
      case 'ArrowLeft':
      case 'ArrowUp':
        next = (i - 1 + DYES.length) % DYES.length
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = DYES.length - 1
        break
      default:
        return
    }
    e.preventDefault()
    setActive(DYES[next].id)
    const el = document.getElementById(`swatch-${DYES[next].id}`)
    el?.focus()
  }

  return (
    <div
      className="min-h-screen bg-[#efe7d6] font-sans text-[#2b2620] antialiased selection:bg-[#a8492c] selection:text-[#efe7d6]"
      style={{ '--accent': dye.hex } as CSSProperties}
    >
      <PreviewChrome company={company} />

      {/* ── Nav ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#2b2620]/12 bg-[#efe7d6]/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <a href="#top" className="flex items-baseline gap-2.5">
            <span className="font-dmserif text-2xl leading-none text-[#2b2620]">
              Hespa
            </span>
            <span
              className="hidden font-mono text-[10px] tracking-[0.22em] text-[#a8492c] uppercase sm:inline"
              aria-hidden="true"
            >
              jurtalituð ull
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a
              href="#garn"
              className="hidden font-mono text-xs tracking-wide text-[#2b2620]/65 transition-colors hover:text-[#2b2620] md:inline"
            >
              Garn
            </a>
            <a
              href="#litirnir"
              className="hidden font-mono text-xs tracking-wide text-[#2b2620]/65 transition-colors hover:text-[#2b2620] md:inline"
            >
              Litirnir
            </a>
            <a
              href="#sagan"
              className="hidden font-mono text-xs tracking-wide text-[#2b2620]/65 transition-colors hover:text-[#2b2620] md:inline"
            >
              Sagan
            </a>
            <a
              href="#heimsokn"
              className="hidden font-mono text-xs tracking-wide text-[#2b2620]/65 transition-colors hover:text-[#2b2620] md:inline"
            >
              Heimsókn
            </a>
            <a
              href="#garn"
              lang="is"
              className="inline-flex items-center gap-1.5 rounded-full bg-[#2b2620] px-4 py-2.5 font-mono text-xs tracking-wide text-[#efe7d6] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8492c]"
            >
              <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
              Skoða garn
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* ── HERO ──────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <Img
              src={`${HERO}?q=80&w=2000${Q}`}
              srcSet={`${HERO}?q=80&w=828${Q} 828w, ${HERO}?q=80&w=1280${Q} 1280w, ${HERO}?q=80&w=2000${Q} 2000w`}
              sizes="100vw"
              fetchpriority="high"
              loading="eager"
              alt="Jurtalitaðar ullarhespur í hlýjum, náttúrulegum tónum"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#c89a3c] via-[#a8492c] to-[#5a7242]"
            />
            {/* Scrim for AA contrast over the photo */}
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(100deg, rgba(43,38,32,0.82) 0%, rgba(43,38,32,0.58) 42%, rgba(43,38,32,0.18) 100%)',
              }}
            />
          </div>

          <div className="mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pt-28 pb-14 md:px-8 md:pt-36 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: EASE }}
              className="max-w-2xl"
            >
              <p className="mb-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.26em] text-[#efe7d6]/90 uppercase">
                <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
                Hespuhúsið · Ölfus
              </p>
              <h1 className="font-dmserif text-[clamp(3rem,9vw,6.5rem)] leading-[1.02] text-[#efe7d6]">
                Litir landsins
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#efe7d6]/90 md:text-xl">
                Íslensk ull, lituð með jurtum úr náttúrunni. Hver litur á sér
                plöntu — rabarbara, lúpínu, skóf og birkilauf — og hverja hespu
                má rekja aftur til landsins sem hún kemur úr.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a
                  href="#garn"
                  lang="is"
                  className="inline-flex items-center gap-2 rounded-full bg-[#a8492c] px-6 py-3.5 font-mono text-sm tracking-wide text-[#efe7d6] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7d6]"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Skoða garn
                </a>
                <a
                  href="#litirnir"
                  className="inline-flex items-center gap-2 rounded-full border border-[#efe7d6]/45 px-6 py-3.5 font-mono text-sm tracking-wide text-[#efe7d6] transition-colors hover:bg-[#efe7d6]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7d6]"
                >
                  Litina og jurtirnar
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── LITIRNIR — the signature dye-colour palette ─────── */}
        <section
          id="litirnir"
          className="scroll-mt-20 border-b border-[#2b2620]/10 px-5 py-20 md:px-8 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Rise>
              <p className="font-mono text-[11px] tracking-[0.26em] text-[#a8492c] uppercase">
                Litaspjaldið
              </p>
              <h2 className="mt-3 max-w-2xl font-dmserif text-[clamp(2rem,5vw,3.5rem)] leading-[1.08]">
                Veldu lit og sjáðu hvaðan hann kemur
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#2b2620]/75">
                Litirnir okkar koma ekki úr glasi heldur úr jörðinni. Smelltu á
                lit — eða notaðu örvalyklana — til að sjá jurtina að baki og
                garnið í þeirri litafjölskyldu.
              </p>
            </Rise>

            {/* Swatch row */}
            <div
              role="radiogroup"
              aria-label="Náttúrulegir litir"
              className="mt-10 flex flex-wrap gap-3"
            >
              {DYES.map((d, i) => {
                const on = d.id === active
                return (
                  <button
                    key={d.id}
                    id={`swatch-${d.id}`}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    tabIndex={on ? 0 : -1}
                    onClick={() => setActive(d.id)}
                    onKeyDown={(e) => onSwatchKey(e, i)}
                    className="group flex items-center gap-3 rounded-full border py-2 pr-5 pl-2 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2620]"
                    style={{
                      borderColor: on ? d.hex : 'rgba(43,38,32,0.18)',
                      background: on ? `${d.hex}1a` : 'transparent',
                    }}
                  >
                    <span
                      className="h-9 w-9 rounded-full ring-1 ring-black/10 transition-transform group-hover:scale-105"
                      style={{
                        background: d.hex,
                        boxShadow: on ? `0 0 0 3px #efe7d6, 0 0 0 5px ${d.hex}` : undefined,
                      }}
                      aria-hidden="true"
                    />
                    <span
                      className="font-mono text-xs tracking-wide"
                      style={{ color: on ? d.ink : 'rgba(43,38,32,0.7)' }}
                    >
                      {d.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Feature panel — tinted by the active dye, with plant + story */}
            <motion.div
              className="mt-8 grid overflow-hidden rounded-3xl border md:grid-cols-2"
              style={{ borderColor: `${dye.hex}55`, background: `${dye.hex}12` }}
              animate={{ background: `${dye.hex}12`, borderColor: `${dye.hex}55` }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="relative min-h-[280px] md:min-h-[420px]">
                <Img
                  key={dye.img}
                  src={dye.img}
                  alt={dye.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  fallbackClassName="bg-gradient-to-br from-[#c89a3c] to-[#5a7242]"
                />
                <span
                  className="absolute inset-x-0 bottom-0 h-2"
                  style={{ background: dye.hex }}
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
                <div className="flex items-center gap-3">
                  <span
                    className="h-11 w-11 shrink-0 rounded-full ring-2 ring-[#efe7d6]"
                    style={{ background: dye.hex }}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.22em] uppercase" style={{ color: dye.ink }}>
                      {dye.plantLatin}
                    </p>
                    <p className="font-dmserif text-2xl leading-tight">{dye.plant}</p>
                  </div>
                </div>
                <h3 className="font-dmserif text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.1]">
                  {dye.name}
                </h3>
                <p className="text-base leading-relaxed text-[#2b2620]/80">
                  {dye.story}
                </p>
                <a
                  href="#garn"
                  className="mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-xs tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2620]"
                  style={{ color: dye.ink }}
                >
                  Garn í þessum lit
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── GARNIÐ — webshop grid (filtered by active colour) ─── */}
        <section
          id="garn"
          className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Rise>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.26em] text-[#a8492c] uppercase">
                    Vefverslun
                  </p>
                  <h2 className="mt-3 font-dmserif text-[clamp(2rem,5vw,3.5rem)] leading-[1.08]">
                    Garnið
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-relaxed text-[#2b2620]/70">
                  Sýnishorn úr verslun — hespur eftir litafjölskyldu. Veldu lit
                  að ofan til að sía. Verslað beint hjá okkur, sent heim.
                </p>
              </div>
              <div className="mt-6" style={{ color: dye.hex }}>
                <DyeRule color={dye.hex} />
              </div>
              <p className="mt-3 font-mono text-xs tracking-wide" style={{ color: dye.ink }} aria-live="polite">
                Sýni: <span className="font-semibold">{dye.name}</span> ·{' '}
                {filtered.length} {filtered.length === 1 ? 'hespa' : 'hespur'}
              </p>
            </Rise>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((y, i) => (
                <Rise key={y.id} delay={i * 0.05}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2b2620]/12 bg-[#f6f0e2]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Img
                        src={y.img}
                        alt={y.alt}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        fallbackClassName="bg-gradient-to-br from-[#c89a3c] to-[#a8492c]"
                      />
                      <span
                        className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-[#2b2620]/80 px-2.5 py-1 font-mono text-[10px] tracking-wide text-[#efe7d6] backdrop-blur-sm"
                      >
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: dye.hex }} aria-hidden="true" />
                        {dye.name}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-dmserif text-xl leading-tight">{y.name}</h3>
                      <p className="mt-1 font-mono text-xs tracking-wide text-[#2b2620]/60">
                        {y.detail}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-3 pt-3">
                        <span className="font-dmserif text-lg" style={{ color: dye.ink }}>
                          {y.price}
                        </span>
                        <button
                          type="button"
                          lang="is"
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#2b2620] px-4 py-2.5 font-mono text-xs tracking-wide text-[#efe7d6] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8492c]"
                        >
                          <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                          Bæta í körfu
                        </button>
                      </div>
                    </div>
                  </article>
                </Rise>
              ))}
            </div>

            <Rise delay={0.1}>
              <div className="mt-10 flex justify-center">
                <a
                  href="#litirnir"
                  className="inline-flex items-center gap-2 rounded-full border border-[#2b2620]/25 px-6 py-3 font-mono text-sm tracking-wide text-[#2b2620] transition-colors hover:bg-[#2b2620]/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8492c]"
                >
                  Skoða alla litina
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── THE MAKER ─────────────────────────────────────── */}
        <section
          id="sagan"
          className="scroll-mt-20 bg-[#2b2620] px-5 py-20 text-[#efe7d6] md:px-8 md:py-28"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Rise>
              <div className="relative">
                <div className="overflow-hidden rounded-3xl">
                  <Img
                    src={photo('photo-1737113551426-9d59e52aa51d', 1200)}
                    alt="Óunnin, óllituð íslensk ull í hlýjum náttúrulegum tónum"
                    className="aspect-[4/5] w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#c89a3c] to-[#5a7242]"
                  />
                </div>
                <div className="absolute -right-3 -bottom-3 hidden w-40 overflow-hidden rounded-2xl ring-4 ring-[#2b2620] sm:block md:-right-6 md:-bottom-6 md:w-52">
                  <Img
                    src={photo('photo-1532623314721-cedde8730d26', 700)}
                    alt="Íslenskt sauðfé úti í náttúrunni"
                    className="aspect-square w-full object-cover"
                    fallbackClassName="bg-gradient-to-br from-[#5a7242] to-[#2b2620]"
                  />
                </div>
              </div>
            </Rise>

            <div>
              <Rise>
                <p className="font-mono text-[11px] tracking-[0.26em] text-[#c89a3c] uppercase">
                  Sagan
                </p>
                <h2 className="mt-3 font-dmserif text-[clamp(2rem,5vw,3.25rem)] leading-[1.1]">
                  Guðrún Bjarnadóttir
                </h2>
                <p className="mt-2 font-mono text-xs tracking-wide text-[#efe7d6]/65">
                  grasafræðingur og jurtalitari
                </p>
                <p className="mt-6 text-base leading-relaxed text-[#efe7d6]/85">
                  Hespuhúsið byggir á þekkingu grasafræðings sem hefur árum saman
                  safnað jurtum og lært hvaða litir leynast í íslenskri náttúru.
                  Hver hespa er handlituð í litlum skömmtum, þar sem plönturnar
                  ráða tóninum — engir tveir pottar verða nákvæmlega eins.
                </p>
                <p className="mt-4 text-base leading-relaxed text-[#efe7d6]/85">
                  Vinnustofan í Ölfusi stendur opin gestum. Þar má sjá litunina,
                  þreifa á ullinni og heyra söguna á bak við hvern lit.
                </p>
              </Rise>

              <Rise delay={0.1}>
                <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-[#efe7d6]/15 pt-7">
                  {MARKS.map((m) => (
                    <div key={m.label}>
                      <dt className="font-dmserif text-2xl text-[#c89a3c] md:text-3xl">
                        {m.k}
                      </dt>
                      <dd className="mt-1 font-mono text-[11px] tracking-wide text-[#efe7d6]/65">
                        {m.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Rise>
            </div>
          </div>
        </section>

        {/* ── HEIMSÓKN — visit the studio ───────────────────── */}
        <section
          id="heimsokn"
          className="scroll-mt-20 px-5 py-20 md:px-8 md:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <Rise>
              <p className="font-mono text-[11px] tracking-[0.26em] text-[#a8492c] uppercase">
                Heimsókn
              </p>
              <h2 className="mt-3 max-w-2xl font-dmserif text-[clamp(2rem,5vw,3.5rem)] leading-[1.08]">
                Komdu í vinnustofuna
              </h2>
            </Rise>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <Rise>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#2b2620]/12 bg-[#f6f0e2] p-7">
                  <MapPin className="h-6 w-6 text-[#a8492c]" aria-hidden="true" />
                  <h3 className="font-dmserif text-xl">Staðsetning</h3>
                  <p className="text-sm leading-relaxed text-[#2b2620]/75">
                    Hespuhúsið, Ölfus
                    <br />
                    Suðurland
                  </p>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Ölfus+Iceland"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-auto inline-flex w-fit items-center gap-1.5 font-mono text-xs tracking-wide text-[#a8492c] transition-colors hover:text-[#8f3c22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a8492c]"
                  >
                    Finna okkur
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </Rise>

              <Rise delay={0.05}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#2b2620]/12 bg-[#f6f0e2] p-7">
                  <Clock className="h-6 w-6 text-[#5a7242]" aria-hidden="true" />
                  <h3 className="font-dmserif text-xl">Opnunartími</h3>
                  <p className="text-sm leading-relaxed text-[#2b2620]/75">
                    Opin vinnustofa á sumrin.
                    <br />
                    Utan þess best að hafa samband og bóka heimsókn.
                  </p>
                  <p className="mt-auto font-mono text-[11px] tracking-wide text-[#2b2620]/50">
                    Tímar eru sýnishorn
                  </p>
                </div>
              </Rise>

              <Rise delay={0.1}>
                <div className="flex h-full flex-col gap-3 rounded-2xl border border-[#2b2620]/12 bg-[#f6f0e2] p-7">
                  <Phone className="h-6 w-6 text-[#38497a]" aria-hidden="true" />
                  <h3 className="font-dmserif text-xl">Hafa samband</h3>
                  <p className="text-sm leading-relaxed text-[#2b2620]/75">
                    Spurningar um liti, garn eða heimsókn?
                  </p>
                  <a
                    href="mailto:hespa@hespa.is"
                    className="mt-auto inline-flex w-fit items-center gap-1.5 font-mono text-xs tracking-wide text-[#38497a] transition-colors hover:text-[#2d3a63] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#38497a]"
                  >
                    hespa@hespa.is
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </Rise>
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden px-5 py-24 md:px-8 md:py-32">
          <div className="absolute inset-0 -z-10">
            <Img
              src={photo('photo-1770572274716-1bae682c48f7', 2000)}
              srcSet={`${photo('photo-1770572274716-1bae682c48f7', 828)} 828w, ${photo('photo-1770572274716-1bae682c48f7', 1280)} 1280w, ${photo('photo-1770572274716-1bae682c48f7', 2000)} 2000w`}
              sizes="100vw"
              alt="Jurtalitaðar ullarhespur að þorna á snúru úti"
              className="h-full w-full object-cover"
              fallbackClassName="bg-gradient-to-br from-[#a8492c] via-[#c89a3c] to-[#5a7242]"
            />
            <div
              className="absolute inset-0"
              aria-hidden="true"
              style={{
                background:
                  'linear-gradient(180deg, rgba(43,38,32,0.55) 0%, rgba(43,38,32,0.78) 100%)',
              }}
            />
          </div>

          <Rise className="mx-auto max-w-3xl text-center text-[#efe7d6]">
            <h2 className="font-dmserif text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.06]">
              Veldu þér lit úr landinu
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#efe7d6]/90">
              Skoðaðu garnið og verslaðu beint hjá okkur — eða komdu við í
              vinnustofunni og sjáðu litunina með eigin augum.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href="#garn"
                lang="is"
                className="inline-flex items-center gap-2 rounded-full bg-[#a8492c] px-7 py-4 font-mono text-sm tracking-wide text-[#efe7d6] transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7d6]"
              >
                <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                Skoða garn
              </a>
              <a
                href="#heimsokn"
                className="inline-flex items-center gap-2 rounded-full border border-[#efe7d6]/45 px-7 py-4 font-mono text-sm tracking-wide text-[#efe7d6] transition-colors hover:bg-[#efe7d6]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efe7d6]"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                Heimsókn
              </a>
            </div>
          </Rise>
        </section>
      </main>

      {/* ── Mobile sticky CTA ─────────────────────────────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#2b2620]/12 bg-[#efe7d6]/95 px-4 py-3 backdrop-blur-md md:hidden">
        <a
          href="#garn"
          lang="is"
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#a8492c] px-5 py-3 font-mono text-sm tracking-wide text-[#efe7d6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b2620]"
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          Skoða garn
        </a>
      </div>

      <PreviewFooter company={company} />
    </div>
  )
}
