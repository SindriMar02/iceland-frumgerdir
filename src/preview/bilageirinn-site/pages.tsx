/* Inner pages of the Bílageirinn site, built only from True Line's own pieces (photo hero with the amber line,
   Projekt Blackbird uppercase heads, Rise / ClipImage reveals, hairline lists, pill actions). Copy comes from the
   fact-checked, polished content.mjs (every string traces to a FACTS id in _docs/bilageirinn-2026-11-11/research). */
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Phone, Send } from 'lucide-react'
import { copy, rental, services, steps } from './content.mjs'
import { IMG } from './data'
import EnquiryForm from './EnquiryForm'
import { ClipImage, ParallaxImage, Rise, TrueLine, pageHref, useT } from './Page'

/* True Line tokens (DESIGN.md). Kept here, not imported: Page.tsx imports this module, so its consts are not
   initialised yet when this file's top level runs. */
const BG = '#0F0D0B', SURFACE = '#1A1613', INK = '#F3F0EA', AMBER = '#E8A23D', DARKINK = '#131313', HAIR = 'rgba(243,240,234,0.14)'
const EBOLD = "'Projekt Blackbird', 'Arial Black', sans-serif"
const BODY = "'Archia', 'Helvetica Neue', Arial, sans-serif"
const MONO = "'Geist Mono', ui-monospace, 'SF Mono', Menlo, monospace"
const EASE = [0.23, 1, 0.32, 1] as const

/* slot → interim photo (stock, flagged in photos.ts; the shoot replaces them) */
export const SERVICE_IMG: Record<string, string> = {
  rettingar: IMG.hero, bilamalun: IMG.booth, bilavidgerdir: IMG.garage, smurstoed: IMG.lift,
  hjolastilling: IMG.wheel, ljosastilling: IMG.headlight, 'bremsu-og-demparaprofun': IMG.brake,
}
const PURPOSES = [copy.purposes_001, copy.purposes_002, copy.purposes_003, copy.purposes_004, copy.purposes_005, copy.purposes_006, copy.purposes_007]
/** Copy strings may carry a <br> for a designed line break; render it as one, never as text. */
const br = (t: string) => t.split(/<br\s*\/?>/i).flatMap((part, i) => (i ? [<br key={i} />, part] : [part]))
const kick = (t: string) => t.replace(/<br\s*\/?>/gi, ' ').replace(/\.$/, '')
const request = (erindi: string) => `${pageHref('/hafa-samband/')}?erindi=${encodeURIComponent(erindi)}#fyrirspurn`

const h2Style = { fontFamily: EBOLD, textTransform: 'uppercase' as const, fontSize: 'clamp(2rem, 4.4vw, 3.4rem)', letterSpacing: '0.005em', lineHeight: 1.06 }
const kickerCls = 'text-[12.5px] tracking-[0.2em] uppercase'

function Actions({ erindi = copy.actions_001, oil = false }: { erindi?: string; oil?: boolean }) {
  const tel = oil ? ['436 6901', '+3544366901'] : ['421 6901', '+3544216901']
  return (
    <div className="flex flex-wrap gap-3">
      <a href={`tel:${tel[1]}`} className="bg-btn bg-btn-solid inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold" style={{ background: AMBER, color: DARKINK, fontFamily: BODY }}>
        <Phone size={15} strokeWidth={2.2} aria-hidden />{oil ? copy.callOil : copy.callShop}
      </a>
      <a href={request(erindi)} className="bg-btn inline-flex min-h-12 items-center gap-2 rounded-full border px-6 text-[15px]" style={{ borderColor: 'rgba(243,240,234,0.4)', color: INK, fontFamily: BODY }}>
        <Send size={15} strokeWidth={2.2} aria-hidden />{copy.sendEnquiry}
      </a>
    </div>
  )
}

/** True Line hero, page size: the photo full-bleed behind, the uppercase head, the amber line drawing in. */
export function PageHero({ kicker, title, lead, img, children }: { kicker: string; title: string; lead: string; img: string; children?: ReactNode }) {
  const reduced = useReducedMotion()
  return (
    <section id="efst" className="relative flex min-h-[78svh] items-end overflow-hidden md:min-h-[86vh]">
      <ParallaxImage src={img} alt="" className="absolute inset-0" />
      <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(15,13,11,0.55) 0%, rgba(15,13,11,0.45) 40%, rgba(15,13,11,0.92) 100%)' }} />
      <div className="relative mx-auto w-full max-w-[1320px] px-5 pb-16 pt-32 md:px-8 md:pb-24">
        <motion.p className={kickerCls} style={{ fontFamily: MONO, color: AMBER }} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}>{kick(kicker)}</motion.p>
        <h1 className="mt-4 max-w-[16ch] text-balance" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(2.6rem, 7.4vw, 5.6rem)', lineHeight: 0.98, letterSpacing: '0.005em', color: INK }}>
          <span className="block overflow-hidden pb-[0.06em]" style={{ paddingTop: '0.18em', marginTop: '-0.18em' }}>
            <motion.span className="block" initial={reduced ? false : { y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}>{br(title)}</motion.span>
          </span>
        </h1>
        <TrueLine className="mt-7 w-full max-w-[520px]" delay={0.55} />
        <motion.div initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}>
          <p className="mt-7 max-w-[58ch] text-[17px] leading-relaxed md:text-[18px]" style={{ fontFamily: BODY, color: INK }}>{lead}</p>
          {children && <div className="mt-9">{children}</div>}
        </motion.div>
      </div>
    </section>
  )
}

/** A section band: label column + heading, alternating ground. */
function Band({ id, label, title, surface, children }: { id?: string; label: string; title: string; surface?: boolean; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t" style={{ borderColor: HAIR, background: surface ? SURFACE : BG }}>
      <div className="mx-auto grid max-w-[1320px] gap-8 px-5 py-20 md:grid-cols-[0.32fr_1fr] md:gap-14 md:px-8 md:py-32">
        <Rise><p className={kickerCls} style={{ fontFamily: MONO, color: AMBER }}>{kick(label)}</p></Rise>
        <div>
          <Rise><h2 className="text-balance" style={h2Style}>{br(title)}</h2></Rise>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </section>
  )
}

const P = ({ children, lede }: { children: ReactNode; lede?: boolean }) => (
  <Rise><p className={`max-w-[62ch] leading-relaxed ${lede ? 'text-[19px] md:text-[21px]' : 'mt-4 text-[17px]'}`} style={{ fontFamily: BODY, color: INK }}>{children}</p></Rise>
)

function QA({ items }: { items: [string, string][] }) {
  return (
    <div className="mt-8 border-t" style={{ borderColor: HAIR }}>
      {items.map(([q, a]) => (
        <Rise key={q}>
          <div className="grid gap-2 border-b py-6 md:grid-cols-[0.9fr_1.1fr] md:gap-10" style={{ borderColor: HAIR }}>
            <h3 className="text-[19px] font-semibold leading-snug" style={{ fontFamily: BODY, color: INK }}>{q}</h3>
            <p className="text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>{a}</p>
          </div>
        </Rise>
      ))}
    </div>
  )
}

/** Numbered operations on the amber rail (the claims chapter's vocabulary). */
function Steps({ items }: { items: [string, string][] }) {
  return (
    <ol className="relative mt-10 border-l pl-8 md:pl-12" style={{ borderColor: 'rgba(232,162,61,0.55)' }}>
      {items.map(([title, text], i) => (
        <li key={title} className="relative pb-10 last:pb-0">
          <span aria-hidden className="absolute -left-[38px] top-1.5 h-3 w-3 rounded-full border-2 md:-left-[54px]" style={{ borderColor: AMBER, background: BG }} />
          <Rise>
            <p className="text-[13px] tracking-[0.2em]" style={{ fontFamily: MONO, color: AMBER }}>{String(i + 1).padStart(2, '0')}</p>
            <h3 className="mt-2" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(1.4rem, 2.4vw, 1.9rem)', color: INK }}>{title}</h3>
            <p className="mt-3 max-w-[60ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>{text}</p>
          </Rise>
        </li>
      ))}
    </ol>
  )
}

function Plate({ src, alt, caption }: { src: string; alt: string; caption?: string }) {
  const { lang } = useT()
  return (
    <figure className="mt-12">
      <ClipImage src={src} alt={alt} className="aspect-[16/9] rounded-[26px]" />
      <figcaption className="bg-workshop-caption"><span>{caption ?? 'Grófin 14a · Reykjanesbær'}</span><span>{lang === 'is' ? 'Mynd til hliðsjónar' : 'Illustrative photograph'}</span></figcaption>
    </figure>
  )
}

function CTA({ erindi, oil }: { erindi?: string; oil?: boolean }) {
  return (
    <Band label={copy.labels_026} title={copy.serviceDetail_002} surface>
      <P lede>{copy.serviceDetail_005}</P>
      <div className="mt-9"><Actions erindi={erindi} oil={oil} /></div>
    </Band>
  )
}

const STEPS: [string, string][] = steps.map(([t, x]) => [t, x])

/** The register of all seven services, each a link to its page, photo beside. */
export function ServiceRegister() {
  return (
    <div className="border-t" style={{ borderColor: HAIR }}>
      {services.map(([name, slug], i) => (
        <Rise key={slug}>
          <a href={pageHref(`/thjonusta/${slug}/`)} className="bg-svc-row group grid items-center gap-5 border-b py-6 md:grid-cols-[64px_1fr_220px] md:gap-8" style={{ borderColor: HAIR }}>
            <span className="text-[13px] tracking-[0.2em]" style={{ fontFamily: MONO, color: AMBER }}>{String(i + 1).padStart(2, '0')}</span>
            <span>
              <span className="block transition-colors" style={{ fontFamily: EBOLD, textTransform: 'uppercase', fontSize: 'clamp(1.5rem, 3vw, 2.3rem)', color: INK, lineHeight: 1.05 }}>{name}</span>
              <span className="mt-2 block text-[16px]" style={{ fontFamily: BODY, color: INK }}>{PURPOSES[i]}</span>
            </span>
            <span className="block overflow-hidden rounded-[18px]"><img src={SERVICE_IMG[slug]} alt="" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" /></span>
          </a>
        </Rise>
      ))}
    </div>
  )
}

/* ───────────── pages ───────────── */

export function OverviewPage() {
  return (
    <>
      <PageHero kicker={copy.overview_001} title={copy.overview_005} lead={copy.overview_002} img={IMG.garage}><Actions erindi={copy.overview_003} /></PageHero>
      <Band label={copy.overview_004} title={copy.home_003}>
        <ServiceRegister />
        <P>{copy.authorisation_001}</P>
      </Band>
      <Band label={copy.labels_018} title={copy.labels_019} surface>
        <P lede>{copy.overview_007}</P>
        <div className="mt-9"><Actions erindi={copy.overview_006} /></div>
      </Band>
    </>
  )
}

const DETAIL: Record<string, { title: string; proof: string; heading: string; intro: string; qa: [string, string][]; extra?: [string, string] }> = {
  rettingar: { title: copy.service_001, proof: copy.service_002, heading: copy.labels_006, intro: copy.service_005,
    qa: [[copy.service_007, copy.service_008], [copy.service_009, copy.service_010], [copy.service_011, copy.service_012], [copy.service_013, rental]] },
  bilamalun: { title: copy.bilamalun_001, proof: copy.bilamalun_002, heading: copy.labels_020, intro: copy.bilamalun_003,
    qa: [[copy.bilamalun_004, copy.bilamalun_005], [copy.bilamalun_006, copy.bilamalun_007], [copy.bilamalun_008, copy.bilamalun_009]], extra: [copy.bilamalun_010, copy.training_001] },
  bilavidgerdir: { title: copy.bilavidgerdir_001, proof: copy.bilavidgerdir_002, heading: copy.bilavidgerdir_003, intro: copy.bilavidgerdir_004,
    qa: [[copy.bilavidgerdir_005, copy.bilavidgerdir_006], [copy.bilavidgerdir_007, copy.authorisation_001]] },
  smurstoed: { title: copy.smurstoed_001, proof: copy.smurstoed_002, heading: copy.labels_021, intro: copy.smurstoed_003,
    qa: [[copy.smurstoed_004, copy.smurstoed_005], [copy.smurstoed_006, copy.smurstoed_007]] },
  hjolastilling: { title: copy.hjolastilling_001, proof: copy.hjolastilling_002, heading: copy.labels_022, intro: copy.hjolastilling_003,
    qa: [[copy.hjolastilling_004, copy.hjolastilling_005], [copy.hjolastilling_006, copy.hjolastilling_007]] },
  ljosastilling: { title: copy.ljosastilling_001, proof: copy.ljosastilling_002, heading: copy.labels_023, intro: copy.ljosastilling_003,
    qa: [[copy.ljosastilling_004, copy.ljosastilling_005], [copy.ljosastilling_006, copy.ljosastilling_007]] },
  'bremsu-og-demparaprofun': { title: copy.labels_024, proof: copy.detailCopy_001, heading: copy.labels_025, intro: copy.detailCopy_002,
    qa: [[copy.detailCopy_003, copy.detailCopy_004], [copy.detailCopy_005, copy.detailCopy_006]] },
}

export function ServicePage({ slug }: { slug: string }) {
  const svc = services.find(s => s[1] === slug)!
  const [name, , erindi] = svc
  const d = DETAIL[slug]
  const oil = slug === 'smurstoed'
  const others = services.filter(s => s[1] !== slug)
  return (
    <>
      <PageHero kicker={`${kick(copy.overview_001)} · ${name}`} title={d.title} lead={d.proof} img={SERVICE_IMG[slug]}><Actions erindi={erindi} oil={oil} /></PageHero>
      <Band label={copy.serviceDetail_001} title={d.heading}>
        <P lede>{d.intro}</P>
        {slug === 'rettingar' && <Steps items={STEPS} />}
        <QA items={d.qa} />
        {d.extra && <><Rise><h3 className="mt-14" style={{ ...h2Style, fontSize: 'clamp(1.5rem, 2.6vw, 2.1rem)' }}>{d.extra[0]}</h3></Rise><P>{d.extra[1]}</P></>}
        {slug === 'rettingar' && <Rise><a href={pageHref('/tjon-og-tryggingar/')} className="bg-link-hover mt-10 inline-flex min-h-11 items-center underline underline-offset-4" style={{ fontFamily: BODY, color: INK }}>{copy.service_006}</a></Rise>}
        {slug === 'bilamalun' && <Plate src={IMG.malun} alt="" />}
      </Band>
      <CTA erindi={erindi} oil={oil} />
      <section className="border-t" style={{ borderColor: HAIR }}>
        <div className="mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-20">
          <p className={kickerCls} style={{ fontFamily: MONO, color: AMBER }}>{copy.overview_004}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {others.map(([n, s]) => <li key={s}><a href={pageHref(`/thjonusta/${s}/`)} className="bg-btn inline-flex min-h-11 items-center rounded-full border px-5 text-[15px]" style={{ borderColor: HAIR, color: INK, fontFamily: BODY }}>{n}</a></li>)}
          </ul>
        </div>
      </section>
    </>
  )
}

export function ClaimsPage() {
  return (
    <>
      <PageHero kicker={copy.labels_010} title={copy.labels_011} lead={copy.claims_001} img={IMG.polish}><Actions erindi={copy.hero_001} /></PageHero>
      <Band label={copy.claims_002} title={copy.labels_003}>
        <P lede>{copy.claims_003}</P>
        <Steps items={STEPS} />
      </Band>
      <Band label={copy.claims_004} title={copy.labels_012} surface>
        <QA items={[[copy.claims_005, copy.claims_006], [copy.claims_007, copy.claims_008]]} />
      </Band>
      <Band label={copy.claims_009} title={copy.labels_013}>
        <P lede>{rental}</P>
        <P>{copy.claims_010}</P>
      </Band>
      <Band label={copy.claims_011} title={copy.labels_014} surface>
        <P>{copy.claims_016}</P>
        <Rise>
          <nav aria-label={copy.claims_017} className="mt-8 flex flex-wrap gap-2">
            {[['https://vis.is/vidbrogd-vid-tjoni/', copy.claims_012], ['https://www.sjova.is/tjon/okutaekjatjon', copy.claims_013], ['https://www.tm.is/tilkynna-tjon?category=bill', copy.claims_014], ['https://www.vordur.is/vid-erum-her-fyrir-thig/tjonathjonusta', copy.claims_015]].map(([u, l]) => (
              <a key={u} href={u} target="_blank" rel="noreferrer" className="bg-btn inline-flex min-h-11 items-center rounded-full border px-5 text-[15px]" style={{ borderColor: HAIR, color: INK, fontFamily: BODY }}>{l}</a>
            ))}
          </nav>
        </Rise>
        <div className="mt-10"><Actions erindi={copy.hero_001} /></div>
      </Band>
    </>
  )
}

export function AboutPage() {
  const timeline: [string, string, string][] = [[copy.about_005, copy.about_006, copy.about_007], [copy.about_008, copy.about_009, copy.about_010], [copy.about_011, copy.about_012, copy.about_013]]
  return (
    <>
      <PageHero kicker={copy.labels_027} title={copy.labels_028} lead={copy.about_001} img={IMG.garage}><Actions erindi={copy.about_002} /></PageHero>
      <Band label={copy.about_003} title={copy.labels_029}>
        <P lede>{copy.about_004}</P>
        <div className="mt-10 border-t" style={{ borderColor: HAIR }}>
          {timeline.map(([year, title, text]) => (
            <Rise key={year}>
              <div className="grid gap-2 border-b py-7 md:grid-cols-[140px_1fr] md:gap-10" style={{ borderColor: HAIR }}>
                <p style={{ fontFamily: EBOLD, fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: AMBER, lineHeight: 1 }}>{year}</p>
                <div>
                  <h3 className="text-[19px] font-semibold" style={{ fontFamily: BODY, color: INK }}>{title}</h3>
                  <p className="mt-2 text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>{text}</p>
                </div>
              </div>
            </Rise>
          ))}
        </div>
      </Band>
      <Band label={copy.about_014} title={copy.labels_030} surface>
        <P lede>{copy.training_001}</P>
        <P>{copy.authorisation_001}</P>
        <P>{copy.about_016}</P>
        <Plate src={IMG.booth} alt="" />
        <div className="mt-10"><Actions erindi={copy.about_015} /></div>
      </Band>
    </>
  )
}

export function ContactPage() {
  return (
    <>
      <PageHero kicker={copy.labels_015} title={copy.labels_015} lead={copy.contact_001} img={IMG.headlight}>
        <div className="flex flex-wrap gap-3">
          <a href="tel:+3544216901" className="bg-btn bg-btn-solid inline-flex min-h-12 items-center gap-2 rounded-full px-6 text-[15px] font-semibold" style={{ background: AMBER, color: DARKINK, fontFamily: BODY }}><Phone size={15} aria-hidden />{copy.callShop}</a>
          <a href="tel:+3544366901" className="bg-btn inline-flex min-h-12 items-center gap-2 rounded-full border px-6 text-[15px]" style={{ borderColor: 'rgba(243,240,234,0.4)', color: INK, fontFamily: BODY }}><Phone size={15} aria-hidden />{copy.callOil}</a>
        </div>
      </PageHero>
      <section id="fyrirspurn" className="scroll-mt-20 border-t" style={{ borderColor: HAIR }}>
        <div className="mx-auto grid max-w-[1320px] gap-12 px-5 py-20 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:px-8 md:py-28">
          <div>
            <Rise>
              <p className={kickerCls} style={{ fontFamily: MONO, color: AMBER }}>{copy.labels_016}</p>
              <h2 className="mt-4 text-balance" style={h2Style}>{br(copy.labels_017)}</h2>
              <TrueLine className="mt-6 w-40" delay={0.2} />
              <p className="mt-6 max-w-[46ch] text-[17px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>{copy.form_enquiryForm_016}</p>
            </Rise>
          </div>
          <Rise><EnquiryForm /></Rise>
        </div>
      </section>
    </>
  )
}

export function PrivacyPage() {
  const blocks: [string, string[]][] = [
    [copy.privacy_006, [copy.privacy_007]],
    [copy.privacy_008, [copy.privacy_009, copy.privacy_010, copy.privacy_011]],
    [copy.privacy_012, [copy.privacy_013]],
    [copy.privacy_014, [copy.privacy_015]],
    [copy.privacy_016, [`${copy.labels_032}bilageirinn@bilageirinn.is.`]],
    [copy.privacy_017, [copy.privacy_018]],
  ]
  return (
    <>
      <PageHero kicker={copy.privacyLabel} title={copy.privacy_001} lead={copy.privacy_002} img={IMG.headlight} />
      <Band label={copy.privacyLabel} title={copy.privacy_004}>
        <div className="border-t" style={{ borderColor: HAIR }}>
          {blocks.map(([h, ps]) => (
            <Rise key={h}>
              <div className="grid gap-3 border-b py-7 md:grid-cols-[0.8fr_1.2fr] md:gap-10" style={{ borderColor: HAIR }}>
                <h3 className="text-[19px] font-semibold" style={{ fontFamily: BODY, color: INK }}>{h}</h3>
                <div className="space-y-3">{ps.map(p => <p key={p} className="text-[16.5px] leading-relaxed" style={{ fontFamily: BODY, color: INK }}>{p}</p>)}</div>
              </div>
            </Rise>
          ))}
        </div>
      </Band>
    </>
  )
}

export function NotFoundPage() {
  return (
    <PageHero kicker="404" title="Síða fannst ekki" lead="Síðan sem þú leitaðir að er ekki til. Veldu þjónustu eða hringdu í 421 6901." img={IMG.garage}>
      <div className="flex flex-wrap gap-3">
        <a href={pageHref('/thjonusta/')} className="bg-btn bg-btn-solid inline-flex min-h-12 items-center rounded-full px-6 text-[15px] font-semibold" style={{ background: AMBER, color: DARKINK, fontFamily: BODY }}>Þjónusta</a>
        <a href="tel:+3544216901" className="bg-btn inline-flex min-h-12 items-center gap-2 rounded-full border px-6 text-[15px]" style={{ borderColor: 'rgba(243,240,234,0.4)', color: INK, fontFamily: BODY }}><Phone size={15} aria-hidden />421 6901</a>
      </div>
    </PageHero>
  )
}
