import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, ExternalLink, Mail, Send, X } from 'lucide-react'
import { fromGallery } from '../lib/preview'
import type { Company } from '../data/companies'
import type { OutreachEmail } from '../data/outreach'

const BASE_KEY = 'frumgerd-preview-base'

function storedUrlFor(company: Company): string {
  try {
    const base = localStorage.getItem(BASE_KEY)
    return base ? `${base}${company.route}` : ''
  } catch {
    return ''
  }
}

/**
 * Floating "Senda frumgerð" button + outreach modal. Only rendered in
 * Sindri's gallery-browsing flow — owners on direct links never see it.
 * Paste a deployed URL once and every prototype derives its own link.
 */
export function SendPreview({ company }: { company: Company }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState(() => storedUrlFor(company))
  const [copied, setCopied] = useState<'subject' | 'body' | 'url' | null>(null)
  const [email, setEmail] = useState<OutreachEmail | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const copiedTimer = useRef<number>()

  // The Icelandic pitch text only loads when Sindri opens the modal — it is
  // a separate chunk that owner visits never request.
  useEffect(() => {
    if (!open || email) return
    import('../data/outreach').then((m) => setEmail(m.outreach[company.slug] ?? null))
  }, [open, email, company.slug])

  const effectiveUrl = url.trim() || company.preview.previewUrlPlaceholder
  const subject = email?.subject ?? ''
  const body = email ? email.body.replace('[HLEKKUR Á FRUMGERÐ]', effectiveUrl) : ''

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    panelRef.current?.querySelector<HTMLElement>('input, button, a')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [open])

  useEffect(() => () => window.clearTimeout(copiedTimer.current), [])

  if (!fromGallery()) return null

  const onUrlChange = (value: string) => {
    setUrl(value)
    try {
      const parsed = new URL(value.trim())
      // Preserve subpaths (e.g. GitHub Pages /repo/) — strip only this
      // company's route suffix so other prototypes derive their own URLs.
      let base = `${parsed.origin}${parsed.pathname}`.replace(/\/+$/, '')
      if (base.endsWith(company.route)) base = base.slice(0, -company.route.length)
      localStorage.setItem(BASE_KEY, base)
    } catch {
      // not a complete URL yet — nothing to remember
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
    window.clearTimeout(copiedTimer.current)
    copiedTimer.current = window.setTimeout(() => setCopied(null), 1600)
  }

  const trapTab = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Tab') return
    const els = panelRef.current?.querySelectorAll<HTMLElement>('button, input, textarea, a[href]')
    if (!els || els.length === 0) return
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

  const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        className="fixed right-4 bottom-20 z-50 flex items-center gap-2 rounded-full bg-slate-900/90 px-4 py-3 text-sm font-medium text-white shadow-xl shadow-black/30 ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-slate-800 md:right-6 md:bottom-6"
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
                  <p className="text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase">
                    Senda frumgerð á eiganda
                  </p>
                  <h2 className="mt-1 font-sans text-2xl font-bold">{company.name}</h2>
                  <a
                    href={company.currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"
                  >
                    Núverandi síða <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Loka"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className="mb-6 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
                Þrjú skref: settu vefinn í loftið → límdu slóðina inn hér að neðan (hún vistast
                fyrir allar frumgerðirnar) → afritaðu póstinn og sendu. Eigendur sem fá beinan
                hlekk sjá hreina síðu án þessara verkfæra.
              </p>

              <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Slóð á frumgerð
              </label>
              <div className="mt-1.5 mb-5 flex gap-2">
                <input
                  value={url}
                  onChange={(e) => onUrlChange(e.target.value)}
                  placeholder={company.preview.previewUrlPlaceholder}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400 focus:bg-white"
                />
                <button
                  onClick={() => copy('url', effectiveUrl)}
                  className="shrink-0 rounded-xl border border-slate-200 px-3 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Afrita slóð"
                >
                  {copied === 'url' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Efnislína
              </label>
              <div className="mt-1.5 mb-5 flex items-center gap-2">
                <p className="min-h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium">
                  {subject || '…'}
                </p>
                <button
                  onClick={() => copy('subject', subject)}
                  className="shrink-0 rounded-xl border border-slate-200 px-3 py-2.5 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
                  aria-label="Afrita efnislínu"
                >
                  {copied === 'subject' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <label className="block text-xs font-semibold tracking-wide text-slate-500 uppercase">
                Tölvupóstur
              </label>
              <textarea
                readOnly
                value={body}
                rows={12}
                className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm leading-relaxed outline-none"
              />

              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <button
                  onClick={() => copy('body', body)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
                >
                  {copied === 'body' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'body' ? 'Afritað!' : 'Afrita texta'}
                </button>
                <a
                  href={mailto}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <Mail className="h-4 w-4" />
                  Opna í tölvupóstforriti
                </a>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Textunum má breyta í <code className="rounded bg-slate-100 px-1 py-0.5">src/data/companies.ts</code>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
