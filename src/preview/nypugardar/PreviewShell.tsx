/**
 * The catalogue-only wrapping around the Nýpugarðar pages: Sindri's outreach
 * chrome at the top, which takes the private company brief (company.ts, with
 * the outreach email and signature in it). The shared prototype footer is
 * gone: the pages carry their real footer (Footer.tsx) everywhere.
 *
 * THIS IS THE ONE FILE in the nypugardar folder allowed to import any of
 * that. Page.tsx reaches it only through a lazy import gated on the
 * compile-time STANDALONE flag, so the client build (glacierview.is) never
 * bundles the brief, the signature, or the catalogue's chrome. See paths.ts.
 */
import { companyEntry } from './company'
import { PreviewChrome } from '../PreviewChrome'

export default function PreviewShell({ part }: { part: 'chrome' }) {
  return part === 'chrome' ? <PreviewChrome company={companyEntry} /> : null
}
