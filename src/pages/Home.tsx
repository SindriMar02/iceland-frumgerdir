import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, MapPin, Send } from 'lucide-react'
import { companies } from '../data/companies'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { markGalleryVisit, setThemeColor } from '../lib/preview'

export default function Home() {
  useEffect(() => {
    document.title = 'Iceland Redesign Prototypes'
    setThemeColor('#0b0e13')
    markGalleryVisit()
  }, [])

  return (
    <div className="grain min-h-screen bg-[#0b0e13] font-sans text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-[11px] font-semibold tracking-[0.38em] text-sky-300/80 uppercase">
            Redesign concepts · júní 2026
          </p>
          <h1 className="mt-5 max-w-3xl font-tall text-5xl leading-[1.04] font-light text-balance md:text-7xl">
            Five Icelandic brands. Five new <em className="text-sky-200 italic">worlds</em>.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/60">
            Interactive landing-page prototypes built to show each owner what their business could
            feel like online. Open a prototype, scroll it like a real site, and use the floating{' '}
            <span className="inline-flex translate-y-0.5 items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold text-white">
              <Send className="h-3 w-3" /> Send preview
            </span>{' '}
            button to grab a ready-made Icelandic outreach email. The tools only appear when you
            browse from this gallery — an owner opening a direct link sees a clean page.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {companies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06} className={i === 0 ? 'md:col-span-2' : ''}>
              <Link
                to={c.route}
                className="group relative block overflow-hidden rounded-[2rem] border border-white/10"
              >
                <Img
                  src={c.cardImage}
                  alt={c.name}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] ${
                    i === 0 ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[16/11]'
                  }`}
                  fallbackClassName={`w-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 ${
                    i === 0 ? 'aspect-[16/10] md:aspect-[21/9]' : 'aspect-[16/11]'
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080c]/95 via-[#06080c]/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-white/12 px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase backdrop-blur-md">
                        {c.concept}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-white/55">
                        <MapPin className="h-3 w-3" />
                        {c.location}
                      </span>
                    </div>
                    <h2 className="mt-3 font-tall text-3xl font-light md:text-4xl">{c.name}</h2>
                    <p className="mt-1.5 max-w-lg text-sm leading-relaxed text-white/60">
                      {c.cardDescription}
                    </p>
                  </div>
                  <span className="mb-1 shrink-0 rounded-full border border-white/20 bg-white/5 p-3 backdrop-blur-md transition-all duration-300 group-hover:rotate-45 group-hover:border-sky-300 group-hover:bg-sky-300 group-hover:text-slate-950">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Footer note */}
        <Reveal className="mt-20">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center md:p-10">
            <p className="text-sm leading-relaxed text-white/55">
              <strong className="text-white/80">Prototype only — redesign concepts.</strong> These
              are design proposals, not the businesses’ real websites. All copy, prices and reviews
              are illustrative samples. Photography via Unsplash placeholders.
            </p>
            <p className="mt-3 text-xs text-white/35">Hugmynd og hönnun · sindri@klubbr.is</p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
