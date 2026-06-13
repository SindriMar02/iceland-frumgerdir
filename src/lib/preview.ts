/**
 * Sindri's outreach tooling (the floating "Senda frumgerð" button and the
 * back-to-gallery chip) must never appear for a business owner opening a
 * direct prototype link. The tools are revealed only after visiting the
 * gallery at "/" in the same browser session — or with a ?tools query flag.
 */

const GALLERY_KEY = 'frumgerdir-gallery'

export function markGalleryVisit(): void {
  try {
    sessionStorage.setItem(GALLERY_KEY, '1')
  } catch {
    // sessionStorage unavailable (private mode) — tools stay hidden
  }
}

export function fromGallery(): boolean {
  try {
    if (new URLSearchParams(window.location.search).has('tools')) return true
    return sessionStorage.getItem(GALLERY_KEY) === '1'
  } catch {
    return false
  }
}

/** Header brand offset that clears the BackChip — empty for owner links. */
export function brandOffsetClass(): string {
  return fromGallery() ? 'ml-12 md:ml-44' : ''
}

/** Per-brand mobile browser chrome tint, set alongside document.title. */
export function setThemeColor(color: string): void {
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', color)
}
