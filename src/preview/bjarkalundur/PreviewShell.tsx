/* The catalogue's chrome around the preview. The ONE file here allowed to reach
   the catalogue (company brief, preview bar); Page.tsx lazy-loads it only when
   not STANDALONE, so the hotel's own build never ships it ([[standalone-client-build]]). */
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'

export default function PreviewShell() {
  return (
    <>
      <PreviewChrome company={companyEntry} />
      <PreviewFooter company={companyEntry} verifiedContent />
    </>
  )
}
