import { useId, useMemo, useState } from 'react'
import {
  EMAIL_HREF,
  HONESTY_LINE,
  LYSING_OPTIONS,
  PHONE_DISPLAY,
  PHONE_HREF,
  SKIP_LABEL,
  SVAEDI_OPTIONS,
  quizMailto,
  recommend,
  type Lysing,
  type Svaedi,
} from './data'
import { ACCENT, ACCENT_DEEP, BODY, DISPLAY, FOCUS, HAIR, INK, MONO, MUTE, SOFT } from './tokens'

/**
 * DEVICE 2 — the quiz-as-hero funnel (mandated), three real steps:
 *   1. single select — "Hvar finnur þú til?" (6 body regions)
 *   2. multi select checkbox pills — "Hvað lýsir þér best?" (the one place
 *      on the page pill-shaped controls are allowed, as real form controls)
 *   3. result — matched service, the matched REAL therapist(s), a tel CTA
 * "SKREF n/3" + a hairline progress bar track every step. Fully keyboard
 * operable: step 1 is real radio-styled buttons, step 2 real <input
 * type="checkbox"> + <label>, nothing depends on drag or hover.
 */
export function Quiz() {
  const [step, setStep] = useState<'svaedi' | 'lysing' | 'result'>('svaedi')
  const [svaedi, setSvaedi] = useState<Svaedi | null>(null)
  const [lysing, setLysing] = useState<Set<Lysing>>(new Set())
  const groupId = useId()

  const svaediOpt = SVAEDI_OPTIONS.find((o) => o.id === svaedi) ?? null
  const lysingOpts = LYSING_OPTIONS.filter((o) => lysing.has(o.id))
  const result = useMemo(() => (svaedi ? recommend(svaedi, lysing) : null), [svaedi, lysing])
  const mailto = result && svaediOpt ? quizMailto(svaediOpt, lysingOpts, result) : EMAIL_HREF

  const reset = () => {
    setStep('svaedi')
    setSvaedi(null)
    setLysing(new Set())
  }

  const toggleLysing = (id: Lysing) => {
    setLysing((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const progress = step === 'svaedi' ? 1 : step === 'lysing' ? 2 : 3

  return (
    <div>
      <div className="rounded-[.625rem] p-6 sm:p-9" style={{ background: '#fff', border: `1px solid ${HAIR}` }}>
        <div className="mb-6 flex items-center gap-3">
          <p style={{ fontFamily: MONO, fontSize: '.72rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">
            Skref {progress}/3
          </p>
          <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: HAIR }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(progress / 3) * 100}%`, background: ACCENT, transition: 'width .4s cubic-bezier(.22,.61,.36,1)' }}
            />
          </div>
        </div>

        {step === 'svaedi' && (
          <fieldset>
            <legend
              style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.15rem, 2.3vw, 1.5rem)', letterSpacing: '-.01em', color: INK }}
            >
              Hvar finnur þú til?
            </legend>
            <div className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {SVAEDI_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={svaedi === opt.id}
                  onClick={() => {
                    setSvaedi(opt.id)
                    setStep('lysing')
                  }}
                  className={`flex min-h-[4.5rem] flex-col items-start justify-center gap-0.5 rounded-[.5rem] px-4 py-3 text-left ${FOCUS}`}
                  style={{
                    background: svaedi === opt.id ? ACCENT_DEEP : '#fff',
                    color: svaedi === opt.id ? '#fff' : INK,
                    border: `1.5px solid ${svaedi === opt.id ? ACCENT_DEEP : HAIR}`,
                    fontFamily: BODY,
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: '.98rem' }}>{opt.label}</span>
                  {opt.hint && (
                    <span style={{ fontSize: '.75rem', color: svaedi === opt.id ? 'rgba(255,255,255,.82)' : MUTE, lineHeight: 1.3 }}>
                      {opt.hint}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 'lysing' && (
          <fieldset>
            <button
              type="button"
              onClick={() => setStep('svaedi')}
              className={`mb-4 inline-flex items-center gap-1.5 ${FOCUS}`}
              style={{ fontFamily: MONO, fontSize: '.78rem', color: MUTE, minHeight: 44 }}
            >
              ← {svaediOpt?.label}
            </button>
            <legend
              style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.15rem, 2.3vw, 1.5rem)', letterSpacing: '-.01em', color: INK }}
            >
              Hvað lýsir þér best?
            </legend>
            <p className="mt-1.5" style={{ fontSize: '.85rem', color: MUTE }}>
              Veldu eitt eða fleiri, eða haltu áfram án þess að velja.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5" role="group" aria-label="Hvað lýsir þér best?">
              {LYSING_OPTIONS.map((opt) => {
                const checked = lysing.has(opt.id)
                const inputId = `${groupId}-${opt.id}`
                return (
                  <span key={opt.id} className="sjr-pill-wrap">
                    <input
                      id={inputId}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleLysing(opt.id)}
                      className="sjr-pill-input"
                    />
                    <label htmlFor={inputId} className="sjr-pill" style={{ fontFamily: BODY }}>
                      <span style={{ fontWeight: 600, fontSize: '.92rem' }}>{opt.label}</span>
                      {opt.hint && <span className="sjr-pill-hint">{opt.hint}</span>}
                    </label>
                  </span>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setStep('result')}
              className={`mt-7 inline-flex items-center rounded-[.375rem] ${FOCUS}`}
              style={{ background: ACCENT_DEEP, color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: '1rem', padding: '15px 26px', minHeight: 52 }}
            >
              Sjá niðurstöðu
            </button>
          </fieldset>
        )}

        {step === 'result' && result && svaediOpt && (
          <div>
            <p style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">
              Fyrir {svaediOpt.label.toLowerCase()}
            </p>
            <p
              className="mt-3"
              style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(1.5rem, 3.6vw, 2.15rem)', letterSpacing: '-.02em', lineHeight: 1.1, color: INK }}
            >
              {result.service}
            </p>
            <p className="mt-4 max-w-[54ch]" style={{ fontFamily: BODY, color: SOFT, lineHeight: 1.6, fontSize: '1rem' }}>
              {result.line}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {result.therapists.map((t) => (
                <div key={t.name} className="flex items-center gap-2.5 rounded-[.5rem] py-1.5 pl-1.5 pr-4" style={{ background: '#F6F7F5', border: `1px solid ${HAIR}` }}>
                  <img
                    src={t.photo}
                    alt={t.name}
                    width={36}
                    height={36}
                    loading="lazy"
                    decoding="async"
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span>
                    <span className="block" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '.86rem', color: INK, lineHeight: 1.2 }}>
                      {t.name}
                    </span>
                    <span className="block" style={{ fontFamily: MONO, fontSize: '.68rem', color: MUTE }}>
                      {result.matched ? t.role : t.house}
                    </span>
                  </span>
                </div>
              ))}
            </div>
            {!result.matched && (
              <p className="mt-2" style={{ fontFamily: MONO, fontSize: '.72rem', color: MUTE }}>
                Hluti af teyminu, ekki tiltekið sérsvið
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={PHONE_HREF}
                className={`inline-flex items-center rounded-[.375rem] ${FOCUS}`}
                style={{ background: ACCENT_DEEP, color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.02rem', padding: '15px 26px', minHeight: 52 }}
              >
                Hringja í {PHONE_DISPLAY}
              </a>
              <a
                href={mailto}
                className={`inline-flex items-center rounded-[.375rem] ${FOCUS}`}
                style={{ border: `1.5px solid ${HAIR}`, color: INK, fontFamily: DISPLAY, fontWeight: 600, fontSize: '1rem', padding: '14px 22px', minHeight: 52 }}
              >
                Senda fyrirspurn
              </a>
            </div>

            <p className="mt-6 max-w-[56ch] rounded-[.5rem] p-4" style={{ background: '#F6F7F5', fontFamily: MONO, fontSize: '.78rem', color: MUTE, lineHeight: 1.6 }}>
              {HONESTY_LINE}
            </p>

            <button type="button" onClick={reset} className={`sjr-link mt-5 inline-flex items-center ${FOCUS}`} style={{ fontFamily: MONO, fontSize: '.8rem', color: MUTE, minHeight: 44 }}>
              Byrja aftur
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 px-1">
        <a href="#thjonusta" className={`sjr-link inline-flex items-center ${FOCUS}`} style={{ fontFamily: MONO, fontSize: '.8rem', color: MUTE, minHeight: 44 }}>
          {SKIP_LABEL}
        </a>
        <a href={PHONE_HREF} className={`sjr-link inline-flex items-center ${FOCUS}`} style={{ fontFamily: MONO, fontSize: '.8rem', color: MUTE, minHeight: 44 }}>
          eða hringja beint í {PHONE_DISPLAY}
        </a>
      </div>
    </div>
  )
}
