/**
 * The single client-facing contact block for SNDR Studio.
 *
 * HARD RULE: no email address of mine ever appears in something a client sees
 * — not on a prototype, not in a proposal, not in a signature. The contact a
 * business owner gets is the phone number and the studio domain, nothing else.
 * Every shared preview surface (PreviewFooter, Proto, Comparison) reads these
 * constants so the rule holds from one edit instead of a dozen copies.
 *
 * The domain is `sndrstudio.is`. The old `sndr-studio.pages.dev` host now
 * serves a "we have moved" notice, so linking it sends a prospect to a dead
 * end — never use it again.
 */
export const STUDIO_PHONE = '845 1758'
export const STUDIO_PHONE_HREF = 'tel:+3548451758'
export const STUDIO_DOMAIN = 'sndrstudio.is'
export const STUDIO_URL = 'https://sndrstudio.is'
