/**
 * Catalogue-only: the preview chrome with this client's catalogue record.
 * Loaded lazily by Chrome.tsx and ONLY when not standalone — this file is the
 * single place in the reynir tree allowed to touch the private catalogue,
 * and it is unreachable from the standalone build by construction.
 */
import { PreviewChrome } from '../PreviewChrome'
import { getPreviewCompany } from '../companies'

const company = getPreviewCompany('reynir')

export default function PreviewShell() {
  return <PreviewChrome company={company} />
}
