import { useEffect, useRef, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Check, Copy, ExternalLink, Mail, Phone } from 'lucide-react'
import { OUTREACH_CONTACTS } from '../data/outreachContacts'
import type { Confidence, OutreachContact } from '../data/outreachContacts'
import { fromGallery, markGalleryVisit, setNoindex, setThemeColor } from '../lib/preview'

/**
 * /outreach — INTERNAL outreach dashboard for the 5 newest redesigns.
 * Gated (redirects unless visited via the gallery / ?tools) and noindexed.
 * Not linked from the public showcase navigation. Nothing here sends mail;
 * the mailto buttons only open a prefilled draft in the user's mail app.
 */

const CONF: Record<Confidence, { label: string; cls: string }> = {
  high: { label: 'Hátt', cls: 'bg-emerald-400/15 text-emerald-300 ring-emerald-400/30' },
  medium: { label: 'Miðlungs', cls: 'bg-amber-400/15 text-amber-300 ring-amber-400/30' },
  low: { label: 'Lágt', cls: 'bg-rose-400/15 text-rose-300 ring-rose-400/30' },
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  const timer = useRef<number>()
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const copy = async () => {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      ok = document.execCommand('copy')
      ta.remove()
    }
    if (!ok) return
    setDone(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setDone(false), 1500)
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
    >
      {done ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? 'Afritað' : label}
    </button>
  )
}

function ContactCard({ c }: { c: OutreachContact }) {
  const conf = CONF[c.confidence]
  const mailto = c.email
    ? `mailto:${c.email}?subject=${encodeURIComponent(c.subject)}&body=${encodeURIComponent(c.emailBody)}`
    : null

  return (
    <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-grotesk text-2xl font-bold tracking-tight text-white">{c.companyName}</h2>
          <p className="mt-1 text-sm text-white/55">
            {c.contactName ? `${c.contactName}${c.contactRole ? ` · ${c.contactRole}` : ''}` : 'Ekkert nafn skráð'}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ring-1 ${conf.cls}`}>
          Áreiðanleiki: {conf.label}
        </span>
      </div>

      {/* contact line */}
      <div className="mt-5 flex flex-wrap items-center gap-2.5">
        {c.email ? (
          <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-white">
            <Mail className="h-4 w-4 text-sky-300" /> {c.email}
          </span>
        ) : (
          <a href={c.contactUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-rose-400/10 px-3 py-1.5 text-sm font-medium text-rose-200 ring-1 ring-rose-400/30 hover:bg-rose-400/15">
            <ExternalLink className="h-4 w-4" /> Ekkert netfang · hafa samband hér
          </a>
        )}
        {c.phone && (
          <span className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-1.5 text-sm text-white/80">
            <Phone className="h-4 w-4 text-white/50" /> {c.phone}
          </span>
        )}
        <a href={c.previewUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/30 px-3 py-1.5 text-sm font-semibold text-sky-300 hover:bg-sky-400/10">
          Forskoðun <ExternalLink className="h-3.5 w-3.5" />
        </a>
        <a href={c.sourceUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-white/45 underline underline-offset-2 hover:text-white/70">
          Heimild
        </a>
      </div>

      {/* subject */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">Efnislína</p>
          <CopyButton text={c.subject} label="Afrita" />
        </div>
        <p className="rounded-xl border border-white/10 bg-[#0b0e13] px-4 py-3 text-sm text-white/90">{c.subject}</p>
      </div>

      {/* email body */}
      <div className="mt-4">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">Tölvupóstur</p>
          <div className="flex items-center gap-2">
            <CopyButton text={c.emailBody} label="Afrita texta" />
            {mailto && (
              <a href={mailto} className="inline-flex items-center gap-1.5 rounded-lg bg-sky-300 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-sky-200">
                <Mail className="h-3.5 w-3.5" /> Opna í tölvupósti
              </a>
            )}
          </div>
        </div>
        <pre className="max-h-80 overflow-auto rounded-xl border border-white/10 bg-[#0b0e13] px-4 py-3 font-sans text-sm leading-relaxed whitespace-pre-wrap text-white/85">{c.emailBody}</pre>
      </div>

      {/* follow-up */}
      <details className="mt-4 rounded-xl border border-white/10 bg-[#0b0e13]/60">
        <summary className="cursor-pointer list-none px-4 py-3 text-sm font-semibold text-white/70 hover:text-white">
          Eftirfylgni →
        </summary>
        <div className="border-t border-white/10 px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-sm text-white/70">{c.followUpSubject}</p>
            <CopyButton text={c.followUpBody} label="Afrita" />
          </div>
          <pre className="overflow-auto rounded-lg bg-black/30 px-3 py-2.5 font-sans text-sm leading-relaxed whitespace-pre-wrap text-white/80">{c.followUpBody}</pre>
        </div>
      </details>

      {c.notes && <p className="mt-4 text-xs leading-relaxed text-white/45">{c.notes}</p>}
    </article>
  )
}

export default function Outreach() {
  useEffect(() => {
    document.title = 'Útsendingar — innra verkfæri'
    setThemeColor('#0b0e13')
    markGalleryVisit()
    const restore = setNoindex(true)
    return restore
  }, [])

  if (!fromGallery()) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-[#0b0e13] font-sans text-white">
      <div className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-grotesk text-[11px] font-semibold tracking-[0.32em] text-sky-300/80 uppercase">
              Innra verkfæri · ekki hluti af safninu
            </p>
            <h1 className="mt-3 font-grotesk text-3xl font-bold tracking-tight md:text-4xl">Útsendingar</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/55">
              Tilbúnir íslenskir tölvupóstar fyrir nýju endurhönnunina fimm, með forskoðunarhlekk og
              afritunarhnöppum. Ekkert er sent sjálfkrafa, hnapparnir opna aðeins drög í póstforritinu þínu.
            </p>
          </div>
          <Link to="/?tools" className="rounded-full px-4 py-2.5 text-sm font-medium text-white/60 ring-1 ring-white/15 transition-colors hover:text-white hover:ring-white/30">
            <ArrowLeft className="mr-1.5 inline h-4 w-4" />
            Yfirlit
          </Link>
        </div>

        <div className="mt-10 space-y-5">
          {OUTREACH_CONTACTS.map((c) => (
            <ContactCard key={c.id} c={c} />
          ))}
        </div>
      </div>
    </div>
  )
}
