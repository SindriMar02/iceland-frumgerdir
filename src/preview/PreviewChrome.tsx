import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Copy, ExternalLink, Mail, Send, X } from 'lucide-react'
import { fromGallery } from '../lib/preview'
import type { PreviewCompany } from './companies'

const BASE_KEY = 'frumgerd-preview-base'
const DEFAULT_BASE = 'https://sindrimar02.github.io/iceland-frumgerdir'

/**
 * Internal tooling shown on a redesign preview ONLY in Sindri's flow (after the
 * dashboard / ?tools). An owner opening a direct preview link sees a clean page.
 * Renders a back-to-dashboard chip and a floating "send" button + outreach modal.
 */
export function PreviewChrome({ company }: { company: PreviewCompany }) {
  const [open, setOpen] = useState(false)
  const [base, setBase] = useState(() => {
    try {
      return localStorage.getItem(BASE_KEY) || DEFAULT_BASE
    } catch {
      return DEFAULT_BASE
    }
  })
  const [copied, setCopied] = useState<'subject' | 'body' | 'url' | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number>()

  const previewUrl = `${base.replace(/\/+$/, '')}${company.route}`
  const body = company.outreach.body.replace('[HLEKKUR Á FRUMGERÐ]', previewUrl)
  const mailto = `mailto:${company.ownerEmail}?subject=${encodeURIComponent(company.outreach.subject)}&body=${encodeURIComponent(body)}`

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('input,button,a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  if (!fromGallery()) return null

  const onBase = (v: string) => {
    setBase(v)
    try {
      const u = new URL(v.trim())
      let b = `${u.origin}${u.pathname}`.replace(/\/+$/, '')
      if (b.endsWith(company.route)) b = b.slice(0, -company.route.length)
      localStorage.setItem(BASE_KEY, b || DEFAULT_BASE)
    } catch {
      /* incomplete URL */
    }
  }

  const copy = async (kind: 'subject' | 'body' | 'url', text: string) => {
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
    setCopied(kind)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(null), 1600)
  }

  const trapTab = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const els = panelRef.current?.querySelectorAll<HTMLElement>('button,input,textarea,a[href]')
    if (!els?.length) return
    const first = els[0]
    const last = els[els.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return (
    <>
      {/* Internal tools paired at the bottom corners so they never collide
          with each page's own top nav (and clear the mobile sticky bar). */}
      <Link
        to="/admin/previews"
        lang="is"
        className="fixed bottom-20 left-4 z-50 inline-flex items-center gap-1.5 rounded-full bg-slate-900/85 px-3 py-2.5 text-xs font-semibold text-white shadow-lg ring-1 ring-white/15 backdrop-blur-md transition-all hover:gap-2.5 hover:bg-slate-900 md:bottom-6 md:left-6 md:px-3.5"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden md:inline">Verkefnayfirlit</span>
      </Link>

      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="fixed right-4 bottom-20 z-50 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-white shadow-xl shadow-black/30 ring-1 ring-white/20 backdrop-blur-md transition-colors md:right-6 md:bottom-6"
        style={{ background: company.accent }}
        aria-label="Senda frumgerð á eiganda"
        lang="is"
      >
        <Send className="h-4 w-4" />
        <span className="hidden sm:inline">Senda frumgerð</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/70 backdrop-blur-sm sm:items-center sm:p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: 48, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 48, scale: 0.98 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={trapTab}
              className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl bg-white p-6 text-slate-900 shadow-2xl sm:rounded-3xl md:p-8"
              role="dialog"
              aria-modal="true"
              aria-label={`Senda frumgerð: ${company.name}`}
              lang="is"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">Senda frumgerð á eiganda</p>
                  <h2 className="mt-1 font-sans text-2xl font-bold">{company.name}</h2>
                  <a href={company.currentUrl} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800">
                    Núverandi síða <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700" aria-label="Loka">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">Slóð á frumgerð (vistast fyrir öll verkefnin)</label>
              <div className="mt-1.5 mb-5 flex gap-2">
                <input value={base} onChange={(e) => onBase(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white" />
                <button onClick={() => copy('url', previewUrl)} className="shrink-0 rounded-xl border border-slate-200 px-3 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800" aria-label="Afrita slóð">
                  {copied === 'url' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">Viðtakandi</label>
              <p className="mt-1.5 mb-5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium">{company.ownerEmail}</p>

              <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">Efnislína</label>
              <div className="mt-1.5 mb-5 flex items-center gap-2">
                <p className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium">{company.outreach.subject}</p>
                <button onClick={() => copy('subject', company.outreach.subject)} className="shrink-0 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800" aria-label="Afrita efnislínu">
                  {copied === 'subject' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">Tölvupóstur</label>
              <textarea readOnly value={body} rows={13} className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-relaxed outline-none" />

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button onClick={() => copy('body', body)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700">
                  {copied === 'body' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'body' ? 'Afritað!' : 'Afrita texta'}
                </button>
                <a href={mailto} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50">
                  <Mail className="h-4 w-4" />
                  Opna í tölvupóstforriti
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
