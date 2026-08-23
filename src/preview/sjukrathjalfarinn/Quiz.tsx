import { useMemo, useState } from 'react'
import {
  EMAIL_HREF,
  HONESTY_LINE,
  PHONE_DISPLAY,
  PHONE_HREF,
  SKIP_LABEL,
  SVAEDI_OPTIONS,
  STADA_OPTIONS,
  quizMailto,
  recommend,
  type Stada,
  type Svaedi,
} from './data'
import { ACCENT, ACCENT_DEEP, BODY, DISPLAY, FOCUS, HAIR, INK, MONO, MUTE, SOFT } from './tokens'

/**
 * DEVICE 2 — the quiz-as-hero funnel (mandated), adapted from thegrind.nl's
 * "hero IS the form" device (thegrind-teardown-mjolnir, "the funnel"): no
 * separate hero copy block handing off to a form elsewhere, the hero itself
 * is the two-question triage, ending on a real recommendation and a working
 * booking handoff instead of a demo-call CTA.
 *
 * DEVICE 8 — the self-drawing marker, adapted from the reference's
 * "self-drawing signature" (device 12 in the catalogue, there a founder's
 * autograph; here a stroke-dasharray ring that draws itself around whichever
 * body-map button the visitor picks, confirming the selection).
 *
 * Fully keyboard operable: every option is a real <button>, Tab/Enter/Space
 * all work, nothing depends on drag or hover. The body-map artwork is purely
 * decorative (aria-hidden); the buttons carry their own visible text labels
 * at every breakpoint, so the diagram is flavour, not the interface.
 */
export function Quiz() {
  const [step, setStep] = useState<'svaedi' | 'stada' | 'result'>('svaedi')
  const [svaedi, setSvaedi] = useState<Svaedi | null>(null)
  const [stada, setStada] = useState<Stada | null>(null)

  const svaediOpt = SVAEDI_OPTIONS.find((o) => o.id === svaedi) ?? null
  const stadaOpt = STADA_OPTIONS.find((o) => o.id === stada) ?? null
  const result = useMemo(() => (svaedi && stada ? recommend(svaedi, stada) : null), [svaedi, stada])
  const mailto = result && svaediOpt && stadaOpt ? quizMailto(svaediOpt, stadaOpt, result) : EMAIL_HREF

  const reset = () => {
    setStep('svaedi')
    setSvaedi(null)
    setStada(null)
  }

  const progress = step === 'svaedi' ? 1 : step === 'stada' ? 2 : 2

  return (
    <div>
      <div
        className="rounded-[1.75rem] p-6 sm:p-9"
        style={{ background: '#fff', border: `1px solid ${HAIR}`, boxShadow: '0 30px 70px -35px rgba(21,25,28,.28)' }}
      >
        {step !== 'result' && (
          <div className="mb-6 flex items-center gap-3">
            <p style={{ fontFamily: MONO, fontSize: '.72rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">
              Skref {progress} af 2
            </p>
            <div className="h-1 flex-1 overflow-hidden rounded-full" style={{ background: HAIR }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${progress === 1 ? 50 : 100}%`, background: ACCENT, transition: 'width .4s cubic-bezier(.22,.61,.36,1)' }}
              />
            </div>
          </div>
        )}

        {step === 'svaedi' && (
          <fieldset>
            <legend
              style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.15rem, 2.3vw, 1.45rem)', letterSpacing: '-.015em', color: INK }}
            >
              Veldu svæðið sem á best við
            </legend>
            <div className="sjr-bodymap mt-6">
              <BodyMapArt />
              <div className="sjr-bodymap-grid">
                {SVAEDI_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    data-region={opt.id}
                    aria-pressed={svaedi === opt.id}
                    onClick={() => {
                      setSvaedi(opt.id)
                      setStep('stada')
                    }}
                    className={`sjr-bodymap-btn group inline-flex w-full items-center gap-2 rounded-full px-4 py-3 text-left ${FOCUS}`}
                    style={{
                      background: svaedi === opt.id ? ACCENT_DEEP : '#fff',
                      color: svaedi === opt.id ? '#fff' : INK,
                      border: `1.5px solid ${svaedi === opt.id ? ACCENT_DEEP : HAIR}`,
                      minHeight: 48,
                      fontFamily: BODY,
                      fontWeight: 600,
                      fontSize: '.94rem',
                      boxShadow: '0 10px 26px -18px rgba(21,25,28,.35)',
                    }}
                  >
                    <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true" style={{ flexShrink: 0 }}>
                      <circle
                        className="sjr-ring"
                        data-drawn={svaedi === opt.id}
                        style={{ '--ring-len': 170 } as React.CSSProperties}
                        cx="32"
                        cy="32"
                        r="27"
                        fill="none"
                        stroke={svaedi === opt.id ? '#fff' : ACCENT_DEEP}
                        strokeWidth="3"
                      />
                      <circle cx="32" cy="32" r="6" fill={svaedi === opt.id ? '#fff' : ACCENT_DEEP} />
                    </svg>
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </fieldset>
        )}

        {step === 'stada' && (
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
              style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.15rem, 2.3vw, 1.45rem)', letterSpacing: '-.015em', color: INK }}
            >
              Hvað lýsir stöðunni best?
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {STADA_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setStada(opt.id)
                    setStep('result')
                  }}
                  className={`inline-flex flex-col items-start gap-0.5 rounded-2xl px-5 py-4 text-left ${FOCUS}`}
                  style={{ background: '#fff', border: `1.5px solid ${HAIR}`, minHeight: 56, fontFamily: BODY }}
                >
                  <span style={{ fontWeight: 600, fontSize: '1rem', color: INK }}>{opt.label}</span>
                  {opt.hint && <span style={{ fontSize: '.82rem', color: MUTE }}>{opt.hint}</span>}
                </button>
              ))}
            </div>
          </fieldset>
        )}

        {step === 'result' && result && svaediOpt && stadaOpt && (
          <div>
            <p style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.12em', color: MUTE }} className="uppercase">
              Fyrir {svaediOpt.label.toLowerCase()}, {stadaOpt.label.toLowerCase()}
            </p>
            <p
              className="mt-3"
              style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(1.7rem, 4.2vw, 2.6rem)', letterSpacing: '-.025em', lineHeight: 1.06, color: INK }}
            >
              {result.service}
            </p>
            <p className="mt-4 max-w-[54ch]" style={{ fontFamily: BODY, color: SOFT, lineHeight: 1.6, fontSize: '1.02rem' }}>
              {result.line}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href={PHONE_HREF}
                className={`inline-flex items-center rounded-full ${FOCUS}`}
                style={{ background: ACCENT_DEEP, color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.02rem', padding: '15px 26px', minHeight: 52 }}
              >
                Hringja í {PHONE_DISPLAY}
              </a>
              <a
                href={mailto}
                className={`inline-flex items-center rounded-full ${FOCUS}`}
                style={{ border: `1.5px solid ${HAIR}`, color: INK, fontFamily: DISPLAY, fontWeight: 600, fontSize: '1rem', padding: '14px 22px', minHeight: 52 }}
              >
                Senda fyrirspurn
              </a>
            </div>

            <p className="mt-6 max-w-[56ch] rounded-xl p-4" style={{ background: '#F6F7F5', fontFamily: MONO, fontSize: '.78rem', color: MUTE, lineHeight: 1.6 }}>
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

/** Purely decorative, aria-hidden. An abstract, rounded standing figure, not
 * a literal anatomical diagram, kept soft to match the Gabarito language. */
function BodyMapArt() {
  return (
    <svg
      viewBox="0 0 200 420"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
      style={{ opacity: 0.14 }}
    >
      <circle cx="100" cy="46" r="30" fill={INK} />
      <rect x="55" y="86" width="90" height="150" rx="45" fill={INK} />
      <rect x="30" y="230" width="60" height="150" rx="28" fill={INK} />
      <rect x="110" y="230" width="60" height="150" rx="28" fill={INK} />
    </svg>
  )
}
