import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, ArrowUpRight, ExternalLink, Monitor, Smartphone } from 'lucide-react'
import { Reveal } from '../components/Reveal'
import { setThemeColor } from '../lib/preview'

/**
 * /preview/comparison — a public, owner-facing "Fyrir / Eftir" showcase.
 * Clean agency layout. Embeds the live prototypes (same-origin) for "Eftir";
 * attempts a live iframe of the real site for "Fyrir" where the site allows
 * framing, otherwise a respectful "Núverandi vefur" card. Static + GH-Pages
 * friendly. No gating — this is meant to be sent to owners.
 */

const BASE = import.meta.env.BASE_URL // '/' in dev, '/iceland-frumgerdir/' in prod

type Device = 'desktop' | 'mobile'

interface CmpItem {
  name: string
  industry: string
  /** route under BASE, no leading slash */
  route: string
  currentUrl: string
  /** whether to attempt a live iframe of the original (else a respectful card) */
  beforeMode: 'iframe' | 'card'
  improved: string
  accent: string
}

const ITEMS: CmpItem[] = [
  {
    name: 'Tjöruhúsið',
    industry: 'Veitingahús',
    route: 'preview/tjoruhusid',
    currentUrl: 'https://www.tjoruhusid.is',
    beforeMode: 'iframe',
    improved:
      'Sterkari fyrsta sýn, skýrari framsetning á matnum og hlaðborðinu, og einfaldari leið til að bóka borð — allt í betri upplifun í síma.',
    accent: '#d98a3d',
  },
  {
    name: 'Rjómabúið Erpsstaðir',
    industry: 'Matvælaframleiðsla',
    route: 'preview/erpsstadir',
    currentUrl: 'https://erpsstadir.is',
    beforeMode: 'card',
    improved:
      'Skýrari upplýsingar um opnunartíma og vörur, sterkari fyrsta sýn og betri framsetning á sögunni á bak við ísinn.',
    accent: '#e0a43a',
  },
  {
    name: 'GJ Travel',
    industry: 'Ferðaþjónusta',
    route: 'gj-travel',
    currentUrl: 'https://gjtravel.is',
    beforeMode: 'iframe',
    improved:
      'Sterkari fyrsta sýn, betri framsetning á níutíu ára sögu fyrirtækisins og einfaldari leið fyrir hópa að senda fyrirspurn.',
    accent: '#c73e1d',
  },
  {
    name: 'Eldhestar',
    industry: 'Upplifun',
    route: 'eldhestar',
    currentUrl: 'https://eldhestar.is',
    beforeMode: 'card',
    improved:
      'Betri framsetning á upplifuninni sjálfri, sterkari fyrsta sýn og einfaldari bókunarleið beint á forsíðunni.',
    accent: '#e2502a',
  },
  {
    name: 'Guesthouse Carina',
    industry: 'Gisting',
    route: 'guesthouse-carina',
    currentUrl: 'https://guesthousecarina.is',
    beforeMode: 'iframe',
    improved:
      'Hlýrri og persónulegri framsetning, betri upplifun í síma og einfaldari leið fyrir gesti að bóka beint.',
    accent: '#1f4e5b',
  },
]

function domainOf(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

/** Faux browser chrome wrapper used for every preview frame. */
function FrameChrome({
  label,
  accent,
  url,
  device,
  children,
}: {
  label: string
  accent?: string
  url: string
  device: Device
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
        </span>
        <span
          className="truncate rounded-md bg-slate-50 px-2.5 py-1 font-mono text-[11px] text-slate-400"
          style={accent ? { color: accent } : undefined}
        >
          {url}
        </span>
        <span className="ml-auto shrink-0 text-[10px] font-semibold tracking-[0.14em] text-slate-400 uppercase">
          {label}
        </span>
      </div>
      <div
        className={`relative bg-slate-50 ${device === 'mobile' ? 'h-[560px]' : 'h-[400px] md:h-[460px]'}`}
      >
        <div className={device === 'mobile' ? 'mx-auto h-full max-w-[380px]' : 'h-full w-full'}>{children}</div>
      </div>
    </div>
  )
}

/** "Eftir" — the live prototype, same-origin iframe (reliable). */
function AfterFrame({ item, device }: { item: CmpItem; device: Device }) {
  const src = `${BASE}${item.route}`
  return (
    <FrameChrome label="Ný hönnun" url="frumgerð" accent={item.accent} device={device}>
      <iframe
        src={src}
        title={`Ný hönnun fyrir ${item.name}`}
        loading="lazy"
        className="h-full w-full border-0 bg-white"
      />
    </FrameChrome>
  )
}

/** "Fyrir" — live original where framing is allowed, else a respectful card. */
function BeforeFrame({ item, device }: { item: CmpItem; device: Device }) {
  const dom = domainOf(item.currentUrl)
  const [status, setStatus] = useState<'loading' | 'ok' | 'fail'>(
    item.beforeMode === 'iframe' ? 'loading' : 'fail',
  )
  const timer = useRef<number>()

  useEffect(() => {
    if (item.beforeMode !== 'iframe') return
    setStatus('loading')
    timer.current = window.setTimeout(() => setStatus((s) => (s === 'ok' ? s : 'fail')), 4500)
    return () => window.clearTimeout(timer.current)
  }, [item.beforeMode, item.currentUrl])

  const showCard = status === 'fail'

  return (
    <FrameChrome label="Núverandi vefur" url={dom} device={device}>
      {showCard ? (
        <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
          <span className="font-mono text-xs tracking-[0.2em] text-slate-400 uppercase">Núverandi vefur</span>
          <p className="font-grotesk text-xl font-semibold text-slate-700">{dom}</p>
          <p className="max-w-xs text-sm leading-relaxed text-slate-500">
            Opnaðu núverandi vef í nýjum flipa til að bera hann saman við nýju hönnunina.
          </p>
          <a
            href={item.currentUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-900 hover:text-slate-900"
          >
            Skoða núverandi vef
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      ) : (
        <>
          {status === 'loading' && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
              <span className="font-mono text-xs tracking-[0.2em] text-slate-400 uppercase">Hleð inn…</span>
            </div>
          )}
          <iframe
            src={item.currentUrl}
            title={`Núverandi vefur — ${item.name}`}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setStatus('ok')}
            className="h-full w-full border-0 bg-white"
          />
        </>
      )}
    </FrameChrome>
  )
}

export default function Comparison() {
  const [device, setDevice] = useState<Device>('desktop')

  useEffect(() => {
    document.title = 'Sindri Már — Vefhönnun · Fyrir og eftir'
    setThemeColor('#ffffff')
  }, [])

  return (
    <div lang="is" className="min-h-screen bg-white font-sans text-slate-900">
      {/* Sticky nav */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#top" className="font-grotesk text-sm font-semibold tracking-tight text-slate-900">
            Sindri Már <span className="text-slate-400">— Vefhönnun</span>
          </a>
          <a
            href="mailto:sindrimar02@gmail.com"
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
          >
            Hafðu samband
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden px-5 md:px-8">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-sky-100/60 blur-3xl" />
        <div className="relative mx-auto max-w-3xl py-20 text-center md:py-28">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-[11px] font-medium tracking-[0.28em] text-slate-400 uppercase"
          >
            Fyrir og eftir · íslensk fyrirtæki
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 font-grotesk text-4xl font-bold tracking-tight text-balance md:text-6xl"
          >
            Sjáðu muninn á núverandi vef og nýrri hönnun
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600"
          >
            Við tókum nokkur íslensk fyrirtæki og settum saman hraðar frumgerðir sem sýna hvernig
            sterkari vefur gæti litið út.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="mt-9 flex items-center justify-center"
          >
            <a
              href="#examples"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('examples')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="group inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-700"
            >
              Skoða dæmi
              <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Examples */}
      <section id="examples" className="mx-auto max-w-6xl px-5 pb-24 md:px-8">
        {/* Device toggle */}
        <div className="sticky top-[57px] z-40 -mx-5 mb-10 flex items-center justify-center gap-3 bg-white/85 px-5 py-3 backdrop-blur-md md:top-[61px]">
          <span className="text-xs font-medium text-slate-400">Forskoðun:</span>
          <div className="inline-flex rounded-full border border-slate-200 p-1">
            <button
              onClick={() => setDevice('desktop')}
              aria-pressed={device === 'desktop'}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                device === 'desktop' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Monitor className="h-4 w-4" aria-hidden />
              Tölva
            </button>
            <button
              onClick={() => setDevice('mobile')}
              aria-pressed={device === 'mobile'}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                device === 'mobile' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Smartphone className="h-4 w-4" aria-hidden />
              Sími
            </button>
          </div>
        </div>

        <div className="space-y-20 md:space-y-28">
          {ITEMS.map((item, i) => (
            <Reveal key={item.route} delay={i * 0.04}>
              <article className="scroll-mt-32">
                {/* Heading */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <span
                      className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase"
                      style={{ backgroundColor: `${item.accent}1a`, color: item.accent }}
                    >
                      {item.industry}
                    </span>
                    <h2 className="mt-3 font-grotesk text-3xl font-bold tracking-tight md:text-4xl">{item.name}</h2>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">{item.improved}</p>
                  </div>
                  <a
                    href={`${BASE}${item.route}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 md:self-auto"
                    style={{ backgroundColor: item.accent }}
                  >
                    Opna frumgerð
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>

                {/* Fyrir / Eftir */}
                <div className="mt-7 grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6">
                  <div className="relative">
                    <span className="mb-2 inline-block font-grotesk text-sm font-bold text-slate-400">Fyrir</span>
                    <BeforeFrame item={item} device={device} />
                  </div>
                  <div className="relative">
                    <span className="mb-2 inline-flex items-center gap-1.5 font-grotesk text-sm font-bold" style={{ color: item.accent }}>
                      Eftir
                    </span>
                    <AfterFrame item={item} device={device} />
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-slate-100 bg-slate-50 px-5 py-20 text-center md:px-8 md:py-28">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-grotesk text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Viltu sjá hvernig vefurinn ykkar gæti litið út?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-600">
            Ég get sett saman frumgerð fyrir ykkar fyrirtæki, ykkur að kostnaðarlausu og án
            skuldbindingar. Það eina sem þarf er stutt skilaboð.
          </p>
          <a
            href="mailto:sindrimar02@gmail.com?subject=Ný%20vefs%C3%AD%C3%B0a"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-700"
          >
            Hafðu samband
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <footer className="px-5 py-10 text-center text-xs leading-relaxed text-slate-400 md:px-8">
        <p className="mx-auto max-w-2xl">
          Sindri Már · Vefhönnun ·{' '}
          <a href="mailto:sindrimar02@gmail.com" className="underline underline-offset-2">
            sindrimar02@gmail.com
          </a>
          <br />
          Nýju hönnunirnar eru frumgerðir og hönnunarhugmyndir. Allur sýnishornatexti og myndir eru til
          útskýringar.
        </p>
      </footer>
    </div>
  )
}
