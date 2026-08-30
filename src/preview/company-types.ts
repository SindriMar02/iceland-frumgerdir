/**
 * Shape of a preview company record. Types only — no data — so a preview
 * route can import the type without pulling in the catalogue.
 */

export interface AuditList {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
}

export interface PreviewCompany {
  slug: string
  route: string
  name: string
  sector: string
  location: string
  region: string
  established: string
  currentUrl: string
  ownerEmail: string
  /** Creative-direction codename + one-line essence */
  concept: string
  conceptTagline: string
  /** Primary brand accent for this project (dashboard chips, footer) */
  accent: string
  /** Is the page background dark? (drives shared chrome contrast) */
  dark: boolean
  status: 'Concept ready' | 'In build' | 'Live'
  thumb: string
  audit: AuditList
  /** One-paragraph positioning the redesign is built on */
  positioning: string
  outreach: { subject: string; body: string }
  /**
   * True when `currentUrl` is a third-party OTA/aggregator listing rather than
   * a site the company actually owns/controls (e.g. a Booking.com hotel page).
   * Changes the shared footer's wording so it never calls that link the
   * company's "current website" — see [[feedback-fact-check-before-drafting]].
   */
  noOwnSite?: boolean
  /**
   * Set when this page's photos are the company's own real photography
   * (not Unsplash stock) — suppresses the generic "Myndir frá Unsplash"
   * footer line in favor of the page's own accurate photo-source disclosure.
   */
  ownPhotography?: boolean
  /**
   * Overrides the noun-phrase the footer uses for `currentUrl` when
   * `noOwnSite` is set. Defaults to "Núverandi bókunarsíða (ekki í eigu
   * fyrirtækisins)" — correct for an OTA listing (Booking.com), but wrong
   * for e.g. a business's own Facebook page. See [[feedback-fact-check-before-drafting]].
   */
  currentLabel?: string
  /**
   * Overrides the footer's photo-provenance sentence entirely, for the rare
   * page whose real mix (news photos, Wikimedia, etc.) matches neither the
   * generic Unsplash line nor `ownPhotography`.
   */
  photoCredit?: string
  /**
   * Set when the preview's audience reads English rather than Icelandic - an
   * Airbnb or hotel operator whose guests and, often, whose own manager are
   * not Icelandic speakers. Switches this shared footer's disclaimer and its
   * lang attribute; the page's own copy is a separate decision made in that
   * build. Defaults to Icelandic, which is right for nearly every preview.
   */
  english?: boolean
}
