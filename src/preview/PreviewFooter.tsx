import type { PreviewCompany } from './company-types'
import { SndrBadge } from './SndrBadge'

/**
 * Shared disclaimer footer for every preview. Theme-aware via the company's
 * `dark` flag; otherwise visually quiet so each page's own design carries it.
 * The SNDR Studio badge lives here so every prototype (past and future)
 * carries the same credit mark from one shared edit.
 */
export function PreviewFooter({ company }: { company: PreviewCompany }) {
  const dark = company.dark
  const en = company.english === true
  return (
    <footer
      lang={en ? 'en' : 'is'}
      /* text-sm on phones, text-xs from md up: at text-xs this footer rendered
         at 12px on a 390px screen, below the legibility floor the previews now
         hold to. Desktop is unchanged. */
      className={`px-5 pt-10 pb-28 text-center text-[15px] leading-relaxed md:pb-10 md:text-xs ${
        dark ? 'bg-black text-white/60' : 'bg-neutral-50 text-neutral-500'
      }`}
    >
      <p className="mx-auto max-w-2xl">
        <strong className={dark ? 'text-white/80' : 'text-neutral-600'}>
          {en
            ? "Prototype: a design concept, not the company's real website."
            : 'Frumgerð: hönnunarhugmynd, ekki raunveruleg vefsíða fyrirtækisins.'}
        </strong>{' '}
        {en
          ? 'All text, prices and reviews are samples.'
          : 'Allur texti, verð og umsagnir eru sýnishorn (prototype only, redesign concept).'}{' '}
        {company.photoCredit
          ? company.photoCredit
          : company.ownPhotography
            ? en
              ? 'The photographs are real pictures of the property, not stand-ins.'
              : 'Ljósmyndir eru raunverulegar myndir af staðnum, ekki sýnishorn.'
            : en
              ? "Images from Unsplash, from the company's current site, or worked up from its product photography."
              : 'Myndir frá Unsplash, af núverandi vef fyrirtækisins eða unnar upp úr vörumyndum þess.'}{' '}
        {company.noOwnSite ? (
          <>
            {en
              ? 'The company has no website of its own today.'
              : 'Fyrirtækið á enga eigin vefsíðu í dag.'}{' '}
            {company.currentLabel ??
              (en
                ? 'Current booking page (not owned by the company)'
                : 'Núverandi bókunarsíða (ekki í eigu fyrirtækisins)')}:{' '}
            <a href={company.currentUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {company.currentUrl.replace('https://', '').replace('www.', '')}
            </a>
          </>
        ) : (
          <>
            {en ? 'Current website' : 'Núverandi vefsíða'}:{' '}
            <a href={company.currentUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {company.currentUrl.replace('https://', '').replace('www.', '')}
            </a>
          </>
        )}
      </p>
      <p className="mt-3">
        © 2026 · {en ? 'Concept and design' : 'Hugmynd og hönnun'}:{' '}
        <a href="mailto:sindrimar02@gmail.com" className="underline underline-offset-2">
          sindrimar02@gmail.com
        </a>
      </p>
      <div className={`mx-auto mt-6 flex justify-center border-t pt-6 ${dark ? 'border-white/10' : 'border-neutral-200'}`}>
        <SndrBadge dark={dark} english={en} />
      </div>
    </footer>
  )
}
