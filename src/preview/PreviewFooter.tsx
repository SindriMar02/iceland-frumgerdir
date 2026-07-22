import type { PreviewCompany } from './companies'
import { SndrBadge } from './SndrBadge'

/**
 * Shared disclaimer footer for every preview. Theme-aware via the company's
 * `dark` flag; otherwise visually quiet so each page's own design carries it.
 * The SNDR Studio badge lives here so every prototype (past and future)
 * carries the same credit mark from one shared edit.
 */
export function PreviewFooter({ company }: { company: PreviewCompany }) {
  const dark = company.dark
  return (
    <footer
      lang="is"
      className={`px-5 pt-10 pb-28 text-center text-xs leading-relaxed md:pb-10 ${
        dark ? 'bg-black text-white/60' : 'bg-neutral-50 text-neutral-500'
      }`}
    >
      <p className="mx-auto max-w-2xl">
        <strong className={dark ? 'text-white/80' : 'text-neutral-600'}>
          Frumgerð: hönnunarhugmynd, ekki raunveruleg vefsíða fyrirtækisins.
        </strong>{' '}
        Allur texti, verð og umsagnir eru sýnishorn (prototype only, redesign concept).{' '}
        {company.photoCredit
          ? company.photoCredit
          : company.ownPhotography
            ? 'Ljósmyndir eru raunverulegar myndir af staðnum, ekki sýnishorn.'
            : 'Myndir frá Unsplash, af núverandi vef fyrirtækisins eða unnar upp úr vörumyndum þess.'}{' '}
        {company.noOwnSite ? (
          <>
            Fyrirtækið á enga eigin vefsíðu í dag. {company.currentLabel ?? 'Núverandi bókunarsíða (ekki í eigu fyrirtækisins)'}:{' '}
            <a href={company.currentUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {company.currentUrl.replace('https://', '').replace('www.', '')}
            </a>
          </>
        ) : (
          <>
            Núverandi vefsíða:{' '}
            <a href={company.currentUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
              {company.currentUrl.replace('https://', '').replace('www.', '')}
            </a>
          </>
        )}
      </p>
      <p className="mt-3">
        © 2026 · Hugmynd og hönnun:{' '}
        <a href="mailto:sindrimar02@gmail.com" className="underline underline-offset-2">
          sindrimar02@gmail.com
        </a>
      </p>
      <div className={`mx-auto mt-6 flex justify-center border-t pt-6 ${dark ? 'border-white/10' : 'border-neutral-200'}`}>
        <SndrBadge dark={dark} />
      </div>
    </footer>
  )
}
