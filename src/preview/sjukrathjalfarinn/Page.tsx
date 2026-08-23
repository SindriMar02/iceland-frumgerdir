import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { setThemeColor } from '../../lib/preview'
import './sjukrathjalfarinn.css'
import {
  CANCEL_HREF,
  CANCEL_NOTE,
  EMAIL,
  EMAIL_HREF,
  FRONT_DESK,
  HOPAR,
  HOUSES,
  IMG,
  INSURANCE_CARDS,
  INSURANCE_NOTE,
  JSON_LD,
  LEGAL_NAME,
  MARQUEE_ITEMS,
  NAV,
  PHONE_DISPLAY,
  PHONE_HREF,
  PHOTO_CREDIT,
  SERVICES,
  STAFF,
  STAFF_FEATURED,
  YEARS_RUNNING,
  sjukrathjalfarinnCompany,
} from './data'
import { DragRow, HeroPlate, HighlightText, Plate, Rise, SplitHeading, useScrollEngine } from './primitives'
import { Preloader } from './Preloader'
import { Quiz } from './Quiz'
import { Marquee } from './Marquee'
import { ACCENT, ACCENT_DEEP, BASE, BODY, DISPLAY, FOCUS, GREEN, HAIR, INK, MIST, MONO, MUTE, SOFT } from './tokens'

const company = sjukrathjalfarinnCompany

/* ── live "opið núna" read, weekdays only (no weekend hours are published
   for either house), computed from the two houses' real hours ─────────── */
function readOpen(d: Date): { label: string; state: 'both' | 'strandgata' | 'closed' } {
  const dow = d.getDay()
  const hour = d.getHours() + d.getMinutes() / 60
  if (dow === 0 || dow === 6) return { label: 'Lokað um helgar, opnum kl. 8 á mánudag', state: 'closed' }
  if (hour < 8) return { label: 'Lokað núna, opnum kl. 8', state: 'closed' }
  if (hour < 16) return { label: 'Opið núna á báðum stöðum', state: 'both' }
  if (hour < 17) return { label: 'Opið núna á Strandgötu 75', state: 'strandgata' }
  return { label: 'Lokað núna, opnum aftur kl. 8', state: 'closed' }
}

function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 96 96" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <circle cx="48" cy="48" r="40" fill="none" stroke={ACCENT} strokeWidth="6" strokeDasharray="16 12" />
      <path d="M28 50c7 11 16 11 20 0s13-11 20 0" fill="none" stroke={INK} strokeWidth="6.5" strokeLinecap="round" />
    </svg>
  )
}

export default function SjukrathjalfarinnPage() {
  const [ready, setReady] = useState(false)
  const [menu, setMenu] = useState(false)
  const [open, setOpen] = useState(() => readOpen(new Date()))
  useScrollEngine()

  useEffect(() => setThemeColor(BASE), [])

  useEffect(() => {
    const t = window.setInterval(() => setOpen(readOpen(new Date())), 60000)
    return () => window.clearInterval(t)
  }, [])

  useEffect(() => {
    if (!menu) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const otherHopar = HOPAR.filter((h) => !h.featured)
  const featuredHopar = HOPAR.filter((h) => h.featured)
  const teamPhotos = [IMG.team1, IMG.team2, IMG.team3]

  return (
    <div style={{ background: BASE, color: INK, fontFamily: BODY, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />

      {!ready && <Preloader onDone={() => setReady(true)} />}

      <PreviewChrome company={company} />

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40"
        style={{ background: 'rgba(246,247,245,.92)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${HAIR}` }}
      >
        <div className="mx-auto flex max-w-[1180px] items-center gap-3 px-5 py-3 sm:px-8" style={{ minHeight: 68 }}>
          <a href="#efst" className={`flex items-center gap-2.5 ${FOCUS}`} style={{ minHeight: 44 }} aria-label="Sjúkraþjálfarinn, efst á síðu">
            <Mark size={26} />
            <span
              className="text-[.94rem] sm:text-[1.05rem]"
              style={{ fontFamily: DISPLAY, fontWeight: 700, letterSpacing: '-.02em', whiteSpace: 'nowrap' }}
            >
              sjúkraþjálfarinn
            </span>
          </a>

          <nav className="ml-auto hidden items-center gap-6 lg:flex" aria-label="Aðalvalmynd">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`sjr-link inline-flex items-center text-[.95rem] ${FOCUS}`}
                style={{ color: SOFT, minHeight: 44, fontFamily: BODY, fontWeight: 500 }}
              >
                {n.label}
              </a>
            ))}
          </nav>

          <span
            className="ml-auto hidden items-center gap-2 lg:ml-4 lg:inline-flex"
            style={{ fontFamily: MONO, fontSize: '.76rem', color: open.state === 'closed' ? MUTE : GREEN }}
          >
            <span aria-hidden="true" className="inline-block rounded-full" style={{ width: 8, height: 8, background: open.state === 'closed' ? MUTE : GREEN }} />
            {open.label}
          </span>

          <a
            href={PHONE_HREF}
            className={`ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 text-[.84rem] sm:gap-2 sm:px-5 sm:text-[.92rem] lg:ml-0 ${FOCUS}`}
            style={{ background: ACCENT_DEEP, color: '#fff', fontFamily: MONO, fontWeight: 600, minHeight: 44, whiteSpace: 'nowrap' }}
            aria-label={`Hringja í ${PHONE_DISPLAY}`}
          >
            <Phone size={15} strokeWidth={2} aria-hidden="true" className="shrink-0" />
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          </a>

          <button
            type="button"
            onClick={() => setMenu((v) => !v)}
            aria-expanded={menu}
            aria-label={menu ? 'Loka valmynd' : 'Opna valmynd'}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full lg:hidden ${FOCUS}`}
            style={{ border: `1px solid ${HAIR}` }}
          >
            <span className="relative block h-[13px] w-[19px]" aria-hidden="true">
              <span
                className="absolute left-0 block h-[2px] w-full"
                style={{ background: INK, top: menu ? 5.5 : 0, transform: menu ? 'rotate(45deg)' : 'none', transition: 'top .22s, transform .22s' }}
              />
              <span
                className="absolute left-0 block h-[2px] w-full"
                style={{ background: INK, bottom: menu ? 5.5 : 0, transform: menu ? 'rotate(-45deg)' : 'none', transition: 'bottom .22s, transform .22s' }}
              />
            </span>
          </button>
        </div>
        {menu && (
          <div className="border-t lg:hidden" style={{ borderColor: HAIR, background: BASE }}>
            <nav className="mx-auto max-w-[1180px] px-5 py-2 sm:px-8" aria-label="Valmynd">
              {NAV.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={() => setMenu(false)}
                  className={`flex items-center border-b py-3.5 text-[1.05rem] ${FOCUS}`}
                  style={{ borderColor: HAIR, minHeight: 48, fontFamily: DISPLAY, fontWeight: 600 }}
                >
                  {n.label}
                </a>
              ))}
              <p className="py-3" style={{ fontFamily: MONO, fontSize: '.78rem', color: open.state === 'closed' ? MUTE : GREEN }}>
                {open.label}
              </p>
            </nav>
          </div>
        )}
      </header>

      <main id="efst">
        {/* ── HERO = QUIZ (device 2) ───────────────────────────────────── */}
        <section id="upphaf" className="mx-auto max-w-[1180px] px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <div className="grid gap-10 lg:grid-cols-[1.06fr_.94fr] lg:items-start lg:gap-14">
            <div>
              <p style={{ fontFamily: MONO, fontSize: '.76rem', letterSpacing: '.13em', color: MUTE }} className="uppercase">
                Sjúkraþjálfun í Hafnarfirði síðan 1984
              </p>
              <h1
                className="mt-4"
                style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(2.5rem, 6.4vw, 4.3rem)', letterSpacing: '-.03em', lineHeight: 1.08, color: INK }}
              >
                Hvar finnur þú til?
              </h1>
              <p className="mt-5 max-w-[46ch]" style={{ fontSize: 'clamp(1.02rem, 1.8vw, 1.2rem)', lineHeight: 1.55, color: SOFT }}>
                Svaraðu tveimur stuttum spurningum og fáðu ábendingu um hvaða þjónusta hjá okkur hentar þér, með beinni
                leið til að hringja eða senda fyrirspurn.
              </p>

              <div className="mt-8">
                <Quiz />
              </div>
            </div>

            <HeroPlate src={IMG.heroShoulder} alt="Sjúkraþjálfari styður við öxl skjólstæðings í meðferð." ratio="4 / 5" className="rounded-[1.75rem]" />
          </div>
        </section>

        {/* ── SERVICES (marquee, device 3, + honest cards) ─────────────── */}
        <section id="thjonusta" style={{ background: '#fff' }} aria-labelledby="thjonusta-h">
          <div className="py-10">
            <Marquee items={MARQUEE_ITEMS} />
          </div>
          <div className="mx-auto max-w-[1180px] px-5 pb-20 sm:px-8 sm:pb-28">
            <SplitHeading as="h2" id="thjonusta-h" className="sjr-h2">
              Þjónustan sem hentar þér
            </SplitHeading>

            <div className="mt-11 grid gap-5 sm:grid-cols-2">
              {SERVICES.map((s, i) => {
                const wide = s.id === 'almenn' || s.id === 'namskeid'
                return (
                  <Rise key={s.id} delay={i % 3} as="article" className={wide ? 'sm:col-span-2' : ''}>
                    <div
                      className="flex h-full flex-col rounded-[1.5rem] p-7 sm:p-8"
                      style={{ background: i % 2 === 0 ? MIST : '#fff', border: `1px solid ${HAIR}` }}
                    >
                      <span style={{ fontFamily: MONO, fontSize: '.72rem', letterSpacing: '.12em', color: ACCENT_DEEP }} className="uppercase">
                        {s.tag}
                      </span>
                      <h3 className="mt-3" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.25rem, 2.6vw, 1.55rem)', letterSpacing: '-.02em', color: INK }}>
                        {s.name}
                      </h3>
                      <p className="mt-3 max-w-[54ch] flex-1" style={{ color: SOFT, lineHeight: 1.6 }}>
                        {s.line}
                      </p>
                    </div>
                  </Rise>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── HÓPAR feature (hjartahópar + vatnsleikfimi) ──────────────── */}
        <section id="hopar" style={{ background: BASE }} aria-labelledby="hopar-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <SplitHeading as="h2" id="hopar-h" className="sjr-h2">
              Hóparnir sem gera okkur öðruvísi
            </SplitHeading>
            <Rise>
              <p className="mt-4 max-w-[58ch]" style={{ color: SOFT, fontSize: '1.05rem', lineHeight: 1.6 }}>
                Fastir hópatímar með sjúkraþjálfara, á föstum tíma í hverri viku. Tveir þeirra fá sinn eigin stað hér, því
                fáar stöðvar í bænum bjóða upp á þá.
              </p>
            </Rise>

            <div className="mt-11 grid gap-6 lg:grid-cols-2">
              {featuredHopar.map((h, i) => (
                <Rise key={h.id} delay={i} as="article">
                  <div className="overflow-hidden rounded-[1.75rem]" style={{ border: `1px solid ${HAIR}`, background: '#fff' }}>
                    <Plate
                      src={h.id === 'vatnsleikfimi' ? IMG.pool : IMG.reliefBack}
                      alt={h.id === 'vatnsleikfimi' ? 'Innilaug Suðurbæjarlaugar þar sem vatnsleikfimi fer fram.' : 'Nærmynd af meðferð á baki, samhljómur við hjarta- og lungnaþjálfun.'}
                      ratio="16 / 10"
                      parallax
                    />
                    <div className="p-7 sm:p-8">
                      <span style={{ fontFamily: MONO, fontSize: '.72rem', letterSpacing: '.1em', color: MUTE }} className="uppercase">
                        {h.house}
                      </span>
                      <h3 className="mt-2" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.3rem, 2.8vw, 1.7rem)', letterSpacing: '-.02em', color: INK }}>
                        {h.name}
                      </h3>
                      <p className="mt-3" style={{ color: SOFT, lineHeight: 1.6 }}>
                        {h.line}
                      </p>
                      <p className="mt-4" style={{ fontFamily: MONO, fontSize: '.82rem', color: ACCENT_DEEP }}>
                        {h.schedule}
                      </p>
                    </div>
                  </div>
                </Rise>
              ))}
            </div>

            <Rise delay={2} className="mt-14">
              <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.2rem', color: INK }}>Fleiri hópar</h3>
            </Rise>
            <DragRow className="mt-5">
              {otherHopar.map((h) => (
                <div
                  key={h.id}
                  className="w-[19rem] rounded-[1.5rem] p-6"
                  style={{ background: '#fff', border: `1px solid ${HAIR}`, boxShadow: '0 20px 45px -30px rgba(21,25,28,.3)' }}
                >
                  <span style={{ fontFamily: MONO, fontSize: '.7rem', letterSpacing: '.1em', color: MUTE }} className="uppercase">
                    {h.house}
                  </span>
                  <h4 className="mt-2" style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.15rem', color: INK }}>
                    {h.name}
                  </h4>
                  <p className="mt-2 text-sm" style={{ color: SOFT, lineHeight: 1.55 }}>
                    {h.line}
                  </p>
                  <p className="mt-3" style={{ fontFamily: MONO, fontSize: '.78rem', color: ACCENT_DEEP }}>
                    {h.schedule}
                  </p>
                </div>
              ))}
            </DragRow>
          </div>
        </section>

        {/* ── 40 ÁR / TVÖ HÚS ───────────────────────────────────────────── */}
        <section style={{ background: '#fff' }} aria-labelledby="ar-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr] lg:items-start lg:gap-14">
              <div>
                <Rise>
                  <p style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.12em', color: ACCENT_DEEP }} className="uppercase">
                    {YEARS_RUNNING} ár í Hafnarfirði
                  </p>
                  <h2 id="ar-h" className="sjr-h2 mt-3">
                    Tvö hús, sama fólkið síðan 1984
                  </h2>
                </Rise>

                <HighlightText className="mt-6 max-w-[62ch]">
                  {`Sjúkraþjálfarinn hefur verið starfrækt í Hafnarfirði síðan 1984. Í dag reka þau tvær stöðvar, Strandgötu 75 og Bæjarhraun 2, með 19 sjúkraþjálfurum samtals. Hvor stöð hefur sinn eigin æfingasal og sitt eigið andlit við afgreiðsluna.`}
                </HighlightText>
              </div>

              <Plate
                src={IMG.seniorActive}
                alt="Eldri kona við æfingar, orkumikil og einbeitt."
                ratio="4 / 5"
                className="rounded-[1.5rem]"
                parallax
              />
            </div>

            <div className="mt-11 grid gap-6 md:grid-cols-2">
              {HOUSES.map((house, i) => (
                <Rise key={house.id} delay={i} as="article">
                  <div className="overflow-hidden rounded-[1.75rem]" style={{ border: `1px solid ${HAIR}` }}>
                    <div className="grid grid-cols-2 gap-[2px]" style={{ background: HAIR }}>
                      <Plate src={i === 0 ? IMG.gym1 : IMG.gym2} alt="Æfingasalur Sjúkraþjálfarans, mynd af vef þeirra." ratio="1 / 1" />
                      <Plate src={i === 0 ? IMG.gym3 : IMG.gym4} alt="Æfingasalur Sjúkraþjálfarans, mynd af vef þeirra." ratio="1 / 1" />
                    </div>
                    <div className="p-7 sm:p-8" style={{ background: MIST }}>
                      <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.4rem', letterSpacing: '-.02em', color: INK }}>{house.name}</h3>
                      <p className="mt-3" style={{ color: SOFT, lineHeight: 1.6 }}>
                        {house.note}
                      </p>
                      <p className="mt-4" style={{ fontFamily: MONO, fontSize: '.8rem', color: MUTE }}>
                        Við afgreiðsluna: {FRONT_DESK.find((f) => f.house === house.name)?.names}
                      </p>
                    </div>
                  </div>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* ── STARFSFÓLK / trust (drag row) ─────────────────────────────── */}
        <section id="starfsfolk" style={{ background: BASE }} aria-labelledby="starf-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <h2 id="starf-h" className="sjr-h2">
                Nítján sjúkraþjálfarar, hver með sitt áhugasvið
              </h2>
            </Rise>

            <DragRow className="mt-11">
              {STAFF_FEATURED.map((s, i) => (
                <div
                  key={s.name}
                  className="w-[16rem] overflow-hidden rounded-[1.5rem]"
                  style={{ background: '#fff', border: `1px solid ${HAIR}`, boxShadow: '0 20px 45px -30px rgba(21,25,28,.3)' }}
                >
                  <Plate src={teamPhotos[i % teamPhotos.length]} alt="Sjúkraþjálfari að störfum í æfingasal." ratio="3 / 4" />
                  <div className="p-5">
                    <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.05rem', color: INK }}>{s.name}</p>
                    <p style={{ fontFamily: MONO, fontSize: '.72rem', color: MUTE, marginTop: 2 }}>{s.role}</p>
                    {s.note && (
                      <p className="mt-2 text-sm" style={{ color: SOFT, lineHeight: 1.5 }}>
                        {s.note}
                      </p>
                    )}
                    <p className="mt-2" style={{ fontFamily: MONO, fontSize: '.7rem', color: ACCENT_DEEP }}>
                      {s.house}
                    </p>
                  </div>
                </div>
              ))}
            </DragRow>

            <Rise delay={1}>
              <p className="mt-8 max-w-[60ch]" style={{ fontFamily: MONO, fontSize: '.85rem', color: MUTE, lineHeight: 1.65 }}>
                Alls starfa {STAFF.length} sjúkraþjálfarar hjá fyrirtækinu, 12 á Strandgötu 75 og 7 í Bæjarhrauni 2, auk
                starfsfólks við afgreiðslu á báðum stöðum.
              </p>
            </Rise>
          </div>
        </section>

        {/* ── VERÐSKRÁ / tryggingar (device 6: global parallax) ─────────── */}
        <section id="gjaldskra" style={{ background: '#fff' }} aria-labelledby="gjald-h">
          <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-16">
            <Plate src={IMG.clinicKnee} alt="Sjúkraþjálfari skoðar hné skjólstæðings á bekk." ratio="4 / 5" parallax />
            <div>
              <SplitHeading as="h2" id="gjald-h" className="sjr-h2">
                Hvernig borgunin virkar
              </SplitHeading>
              <Rise>
                <p className="mt-4 max-w-[52ch]" style={{ color: SOFT, fontSize: '1.05rem', lineHeight: 1.6 }}>
                  Engin opinber verðskrá er birt á vefnum þeirra í dag. Þetta er það sem liggur fyrir um niðurgreiðslu og
                  greiðslufyrirkomulag.
                </p>
              </Rise>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {INSURANCE_CARDS.slice(0, 2).map((c, i) => (
                  <Rise key={c.head} delay={i} as="article">
                    <div className="h-full rounded-2xl p-6" style={{ background: MIST, border: `1px solid ${HAIR}` }}>
                      <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.05rem', color: INK }}>{c.head}</h3>
                      <p className="mt-2 text-sm" style={{ color: SOFT, lineHeight: 1.55 }}>
                        {c.body}
                      </p>
                    </div>
                  </Rise>
                ))}
              </div>
              <Rise delay={2} className="mt-4">
                <div className="rounded-2xl p-6" style={{ background: ACCENT_DEEP, color: '#fff' }}>
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: '1.05rem' }}>{INSURANCE_CARDS[2].head}</h3>
                  <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,.96)', lineHeight: 1.55 }}>
                    {INSURANCE_CARDS[2].body}
                  </p>
                </div>
              </Rise>

              <Rise delay={3}>
                <p className="mt-6" style={{ fontFamily: MONO, fontSize: '.82rem', color: MUTE, lineHeight: 1.6 }}>
                  {INSURANCE_NOTE}
                </p>
              </Rise>
            </div>
          </div>
        </section>

        {/* ── PRACTICAL: staðsetning, tímar, afboðun ────────────────────── */}
        <section id="stadsetning" style={{ background: BASE }} aria-labelledby="stad-h">
          <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 sm:py-28">
            <Rise>
              <p style={{ fontFamily: MONO, fontSize: '.74rem', letterSpacing: '.12em', color: ACCENT_DEEP }} className="uppercase">
                Staðsetning og tímar
              </p>
              <h2 id="stad-h" className="sjr-h2 mt-3">
                Hvert á að koma
              </h2>
            </Rise>

            <div className="mt-11 grid gap-6 md:grid-cols-2">
              {HOUSES.map((house, i) => (
                <Rise key={house.id} delay={i} as="article">
                  <div className="h-full rounded-[1.5rem] p-7 sm:p-8" style={{ background: '#fff', border: `1px solid ${HAIR}` }}>
                    <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', letterSpacing: '-.02em', color: INK }}>
                      {house.name}
                    </h3>
                    <p className="mt-1" style={{ fontFamily: MONO, color: SOFT }}>
                      {house.postcode}
                    </p>
                    <dl className="mt-5 grid gap-2" style={{ fontSize: '.98rem' }}>
                      <div className="flex items-baseline justify-between border-b py-2" style={{ borderColor: HAIR }}>
                        <dt style={{ color: MUTE, fontFamily: MONO, fontSize: '.78rem' }}>Opnunartími</dt>
                        <dd style={{ fontWeight: 600, color: INK }}>{house.openLabel}</dd>
                      </div>
                      <div className="flex items-baseline justify-between py-2">
                        <dt style={{ color: MUTE, fontFamily: MONO, fontSize: '.78rem' }}>Sími</dt>
                        <dd>
                          <a href={PHONE_HREF} className={`sjr-link ${FOCUS}`} style={{ fontWeight: 600, color: INK }}>
                            {PHONE_DISPLAY}
                          </a>
                        </dd>
                      </div>
                    </dl>
                    <a
                      href={house.maps}
                      target="_blank"
                      rel="noreferrer"
                      className={`sjr-link mt-6 inline-flex items-center ${FOCUS}`}
                      style={{ color: ACCENT_DEEP, fontFamily: MONO, fontSize: '.88rem', minHeight: 44 }}
                    >
                      Opna í kortum
                    </a>
                  </div>
                </Rise>
              ))}
            </div>

            <Rise delay={2} className="mt-8">
              <div className="rounded-2xl p-6" style={{ background: '#fff', border: `1px solid ${HAIR}` }}>
                <h3 style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.05rem', color: INK }}>Afboðun tíma</h3>
                <p className="mt-2 max-w-[62ch] text-sm" style={{ color: SOFT, lineHeight: 1.6 }}>
                  {CANCEL_NOTE}
                </p>
                <a href={CANCEL_HREF} target="_blank" rel="noreferrer" className={`sjr-link mt-3 inline-flex items-center ${FOCUS}`} style={{ color: ACCENT_DEEP, fontFamily: MONO, fontSize: '.84rem', minHeight: 44 }}>
                  Afboða tíma
                </a>
              </div>
            </Rise>
          </div>
        </section>

        {/* ── SIGN-OFF ────────────────────────────────────────────────── */}
        <section aria-labelledby="loka-h">
          <div className="mx-auto max-w-[1180px] px-5 py-24 text-center sm:px-8 sm:py-32">
            <Rise>
              <div className="flex justify-center">
                <Mark size={40} />
              </div>
              <h2
                id="loka-h"
                className="mx-auto mt-8 max-w-[20ch]"
                style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 'clamp(2.1rem, 6vw, 3.8rem)', letterSpacing: '-.03em', lineHeight: 1.1, color: INK }}
              >
                Byrjaðu á að segja okkur hvar þú finnur til
              </h2>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#upphaf"
                  className={`inline-flex items-center rounded-full ${FOCUS}`}
                  style={{ background: ACCENT_DEEP, color: '#fff', fontFamily: DISPLAY, fontWeight: 700, fontSize: 'clamp(1.05rem, 2.6vw, 1.3rem)', padding: '18px 32px', minHeight: 58 }}
                >
                  Taka spurningarnar
                </a>
                <a
                  href={PHONE_HREF}
                  className={`inline-flex items-center rounded-full ${FOCUS}`}
                  style={{ border: `1.5px solid ${HAIR}`, color: INK, fontFamily: DISPLAY, fontWeight: 600, fontSize: '1.05rem', padding: '17px 28px', minHeight: 58 }}
                >
                  {PHONE_DISPLAY}
                </a>
              </div>
              <p className="mt-8" style={{ fontFamily: MONO, fontSize: '.82rem', color: MUTE, lineHeight: 1.7 }}>
                {LEGAL_NAME} · Strandgata 75 og Bæjarhraun 2, 220 Hafnarfjörður
                <br />
                <a href={EMAIL_HREF} className={`sjr-link inline-flex items-center ${FOCUS}`} style={{ color: ACCENT_DEEP, minHeight: 44 }}>
                  {EMAIL}
                </a>
              </p>
            </Rise>
          </div>
        </section>
      </main>

      <PreviewFooter company={company} />
      <span className="sr-only">{PHOTO_CREDIT}</span>
    </div>
  )
}
