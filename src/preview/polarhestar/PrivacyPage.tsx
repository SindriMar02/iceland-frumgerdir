import { Link } from 'react-router-dom'
import { useLang } from './lang'
import { homePath } from './paths'
import { useSiteContent } from './sanity'
import { SiteFooter } from './SiteFooter'
import privacy from './privacy.json'

export default function PrivacyPage() {
  const [lang] = useLang()
  const c = useSiteContent()
  const t = privacy[lang]
  return (
    <div lang={lang} className="min-h-screen bg-[#EDF1F7] font-hanken text-[#161B3C]">
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-8 md:py-16">
        <nav aria-label={t.home} className="mb-8 text-sm">
          <Link to={homePath(lang)} className="underline underline-offset-4">Pólar Hestar</Link>
          <span aria-hidden="true"> / </span><span>{t.title}</span>
        </nav>
        <h1 className="font-spectral text-4xl md:text-5xl">{t.title}</h1>
        <p className="mt-6 text-base leading-relaxed">{lang === 'is' ? 'Ábyrgðaraðili' : lang === 'de' ? 'Verantwortlich' : 'Controller'}: Pólarhestar ehf., kt. 550502-5850. {c.ADDRESS}. <a className="underline underline-offset-4" href="mailto:polarhestar@polarhestar.is">polarhestar@polarhestar.is</a>. <a className="underline underline-offset-4" href={c.PHONE_HREF}>{c.PHONE_DISPLAY}</a>.</p>
        {t.sections.map(([heading, text]) => (
          <section key={heading} className="mt-9">
            <h2 className="font-spectral text-2xl">{heading}</h2>
            <p className="mt-3 text-base leading-relaxed text-[#3D4565]">{text}</p>
          </section>
        ))}
        <p className="mt-8 text-sm"><a href="https://www.personuvernd.is" className="underline underline-offset-4">Persónuvernd · personuvernd.is</a></p>
      </main>
      <SiteFooter lang={lang} />
    </div>
  )
}
