/**
 * Catalogue-only: the preview chrome with this client's catalogue record.
 * Loaded lazily by Shell.tsx and ONLY when not standalone — this file is the
 * single place in the katrinisfeld tree allowed to touch the private
 * prospect catalogue, and it is unreachable from her own build by
 * construction, not by discipline.
 */
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { getPreviewCompany } from '../companies'

const company = getPreviewCompany('katrinisfeld')

export function PreviewTop() { return <PreviewChrome company={company} /> }
export default function PreviewBottom() { return <PreviewFooter company={company} /> }
