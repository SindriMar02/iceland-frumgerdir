import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Check, Circle, ExternalLink, Mail, MonitorPlay, X } from 'lucide-react'
import { fromGallery, markGalleryVisit, setNoindex, setThemeColor } from '../lib/preview'
import { Img } from '../components/Img'
import { PREVIEW_COMPANIES } from './companies'

// Weider is pitched separately and is never listed in the public showcase or here.
const PROJECTS = PREVIEW_COMPANIES.filter((c) => c.slug !== 'weider')

/**
 * /admin/previews — internal review dashboard for the five independent
 * redesign projects. Gated (redirects unless fromGallery/?tools), noindexed.
 * Quick-launch each preview, read the per-project audit, or enter a
 * distraction-free presentation mode for client demos.
 */
export default function AdminPreviews() {
  const [present, setPresent] = useState(false)

  useEffect(() => {
    document.title = 'Redesign projects — internal dashboard'
    setThemeColor('#0b0e13')
    markGalleryVisit()
    const restore = setNoindex(true)
    return restore
  }, [])

  if (!fromGallery()) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-[#0b0e13] font-sans text-white">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-grotesk text-[11px] font-semibold tracking-[0.32em] text-sky-300/80 uppercase">
              Internal · not public
            </p>
            <h1 className="mt-3 font-grotesk text-3xl font-bold tracking-tight md:text-4xl">Redesign projects</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
              Five independent client engagements — each its own brand, design system and standalone site.
              Quick-launch a preview, or present them one by one.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="rounded-full px-4 py-2.5 text-sm font-medium text-white/60 ring-1 ring-white/15 transition-colors hover:text-white hover:ring-white/30">
              ← Gallery
            </Link>
            <button
              onClick={() => setPresent((p) => !p)}
              aria-pressed={present}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors ${
                present ? 'bg-sky-400 text-slate-950' : 'bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/15'
              }`}
            >
              {present ? <X className="h-4 w-4" /> : <MonitorPlay className="h-4 w-4" />}
              {present ? 'Exit presentation' : 'Presentation mode'}
            </button>
          </div>
        </div>

        {/* Status strip */}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 border-y border-white/10 py-4 font-grotesk text-xs tracking-wide text-white/50 uppercase">
          <span><span className="text-white">{PROJECTS.length}</span> projects</span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-white">{PROJECTS.length}</span> concepts ready
          </span>
          <span>5 regions · 5 sectors · 5 design systems</span>
        </div>

        {/* Presentation mode — big launch tiles */}
        {present ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PROJECTS.map((c) => (
              <Link
                key={c.slug}
                to={c.route}
                className="group relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10"
              >
                <Img
                  src={c.thumb}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  fallbackClassName="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <span className="inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase" style={{ background: c.accent, color: '#0b0e13' }}>
                    {c.concept}
                  </span>
                  <h2 className="mt-2 font-grotesk text-2xl font-bold">{c.name}</h2>
                  <p className="text-xs text-white/60">{c.location}</p>
                </div>
                <span className="absolute right-4 top-4 rounded-full bg-white/10 p-2 backdrop-blur-md transition-all group-hover:bg-white group-hover:text-slate-950">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          /* Review mode — project cards with audit */
          <div className="mt-10 space-y-5">
            {PROJECTS.map((c, i) => (
              <motion.article
                key={c.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="grid gap-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[260px_1fr] md:p-5"
              >
                {/* thumb */}
                <Link to={c.route} className="group relative block aspect-[16/10] overflow-hidden rounded-xl ring-1 ring-white/10 md:aspect-auto">
                  <Img
                    src={c.thumb}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    fallbackClassName="absolute inset-0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase backdrop-blur-md">
                    <Circle className="h-2 w-2 fill-emerald-400 text-emerald-400" />
                    {c.status}
                  </span>
                </Link>

                {/* info */}
                <div>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold tracking-[0.16em] uppercase">
                        <span style={{ color: c.accent }}>{c.concept}</span>
                        <span className="text-white/30">·</span>
                        <span className="text-white/45">{c.sector}</span>
                        <span className="text-white/30">·</span>
                        <span className="text-white/45">{c.location}</span>
                      </div>
                      <h2 className="mt-1.5 font-grotesk text-2xl font-bold">{c.name}</h2>
                      <p className="mt-1 max-w-xl text-sm leading-relaxed text-white/55">{c.conceptTagline}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Link to={c.route} className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5">
                        Launch <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <a href={`mailto:${c.ownerEmail}`} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-white/60 ring-1 ring-white/15 transition-colors hover:text-white hover:ring-white/30" aria-label={`Email ${c.name}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    </div>
                  </div>

                  {/* audit grid */}
                  <div className="mt-5 grid gap-x-6 gap-y-4 border-t border-white/8 pt-4 sm:grid-cols-3">
                    {([
                      ['Strengths', c.audit.strengths, 'text-emerald-300/80'],
                      ['Weaknesses', c.audit.weaknesses, 'text-rose-300/80'],
                      ['Opportunities', c.audit.opportunities, 'text-sky-300/80'],
                    ] as const).map(([label, items, tone]) => (
                      <div key={label}>
                        <p className={`font-grotesk text-[10px] font-semibold tracking-[0.18em] uppercase ${tone}`}>{label}</p>
                        <ul className="mt-2 space-y-1.5">
                          {items.map((it) => (
                            <li key={it} className="text-xs leading-relaxed text-white/55">{it}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/8 pt-3 font-grotesk text-[11px] tracking-wide text-white/40">
                    <span>{c.established}</span>
                    <a href={c.currentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 underline-offset-2 hover:text-white/70 hover:underline">
                      current site <ExternalLink className="h-3 w-3" />
                    </a>
                    <span className="font-mono">{c.route}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <p className="mt-12 text-center text-xs text-white/30">
          Internal review tool · not public-facing · prototypes are design concepts on sample data.
        </p>
      </div>
    </div>
  )
}
