import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Sparkles } from 'lucide-react'
import { Reveal } from './Reveal'
import { fromGallery } from '../lib/preview'
import type { Company } from '../data/companies'

/**
 * Floating chip back to the prototype gallery. Only rendered for Sindri's
 * own browsing flow (after visiting "/"); owners opening a direct link see
 * a clean page with no gallery escape hatch.
 */
export function BackChip({ dark = false, className = '' }: { dark?: boolean; className?: string }) {
  if (!fromGallery()) return null
  return (
    <Link
      to="/"
      lang="is"
      className={`fixed top-4 left-4 z-50 inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-xs font-semibold backdrop-blur-md transition-all hover:gap-2.5 md:px-3.5 ${
        dark
          ? 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20'
          : 'bg-slate-900/85 text-white shadow-lg hover:bg-slate-900'
      } ${className}`}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="hidden md:inline">Allar frumgerðir</span>
    </Link>
  )
}

interface ThemedProps {
  company: Company
  dark?: boolean
  /** Tailwind classes for the section CTA button */
  accentClassName: string
}

/** "Want this full redesign?" mini section, aimed at the business owner. */
export function WantRedesign({ company, dark = false, accentClassName }: ThemedProps) {
  return (
    <section lang="is" className={dark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}>
      <div className="mx-auto max-w-3xl px-5 py-20 text-center md:py-24">
        <Reveal>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.16em] uppercase ${
              dark ? 'bg-white/10 text-white/80 ring-1 ring-white/15' : 'bg-white text-slate-500 ring-1 ring-slate-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Frumgerð — ekki raunveruleg vefsíða
          </span>
          <h2 className="mt-6 font-sans text-3xl font-bold tracking-tight text-balance md:text-4xl">
            Viltu gera þessa hugmynd að alvöru vefsíðu?
          </h2>
          <p className={`mx-auto mt-4 max-w-xl text-base leading-relaxed ${dark ? 'text-white/70' : 'text-slate-600'}`}>
            Þessi síða er hönnunarhugmynd, unnin að fyrra bragði, sem sýnir hvernig fyrirtækið ykkar
            gæti birst á netinu — sterkari fyrstu kynni, meira traust og fleiri beinar bókanir.
            Fullbúin vefsíða með öllum undirsíðum, bókunarferli og efnisvinnu er nokkurra vikna
            verkefni.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:sindri@klubbr.is?subject=${encodeURIComponent(`Endurhönnun — ${company.name}`)}`}
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold shadow-lg transition-transform hover:-translate-y-0.5 ${accentClassName}`}
            >
              Senda Sindra línu
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <a
              href={company.currentUrl}
              target="_blank"
              rel="noreferrer"
              className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold transition-colors ${
                dark
                  ? 'text-white/70 ring-1 ring-white/20 hover:bg-white/10 hover:text-white'
                  : 'text-slate-600 ring-1 ring-slate-300 hover:bg-white hover:text-slate-900'
              }`}
            >
              Bera saman við núverandi síðu
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <p className={`mt-5 text-xs ${dark ? 'text-white/45' : 'text-slate-400'}`}>
            Engin skuldbinding — svarið aðeins ef hugmyndin kveikir í ykkur.
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/** Footer disclaimer shared by every prototype. */
export function ProtoFooter({ company, dark = false }: { company: Company; dark?: boolean }) {
  return (
    <footer
      lang="is"
      className={`px-5 py-10 text-center text-xs leading-relaxed ${
        dark ? 'bg-slate-950 text-white/40' : 'bg-slate-50 text-slate-400'
      }`}
    >
      <p className="mx-auto max-w-2xl">
        <strong className={dark ? 'text-white/60' : 'text-slate-500'}>
          Frumgerð — hönnunarhugmynd, ekki raunveruleg vefsíða fyrirtækisins.
        </strong>{' '}
        Allur texti, verð, umsagnir og tölur eru sýnishorn (prototype only — redesign concept).
        Myndir frá Unsplash. Núverandi vefsíða:{' '}
        <a
          href={company.currentUrl}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-2"
        >
          {company.currentUrl.replace('https://', '')}
        </a>
      </p>
      <p className="mt-3">
        © 2026 · Hugmynd og hönnun:{' '}
        <a href="mailto:sindri@klubbr.is" className="underline underline-offset-2">
          sindri@klubbr.is
        </a>
      </p>
    </footer>
  )
}
