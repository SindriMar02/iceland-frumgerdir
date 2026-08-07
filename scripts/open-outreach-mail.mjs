#!/usr/bin/env node
// Opens Mail.app with a NEW (never reply-styled) message pre-filled via a plain
// mailto: URL — no AppleScript, no rich-text `content` injection. See memory
// [[feedback-no-applescript-email]] for why that path is permanently banned.
//
// Usage: node open-outreach-mail.mjs <payload.json>
// payload.json: { "to": "owner@example.is", "subject": "...", "body": "...", "revealBanner": true }

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'

const payloadPath = process.argv[2]
if (!payloadPath) {
  console.error('usage: node open-outreach-mail.mjs <payload.json>')
  process.exit(1)
}

const { to = '', subject, body, revealBanner = true } = JSON.parse(readFileSync(payloadPath, 'utf8'))
if (!subject || !body) {
  console.error('payload needs { subject, body } (to may be empty)')
  process.exit(1)
}
/* `to` is deliberately optional. Airbnb-DM-only and enquiry-form-only leads have
   NO email address, and they still deserve a real reviewable draft: mailto: with
   an empty recipient opens a normal compose window with the subject and body
   filled and the To: field blank, ready to address or copy out. */

const mailto = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

// -a Mail forces Apple Mail specifically (not whatever the system mailto default is),
// and execFileSync with an argv array never touches a shell, so nothing here can be
// mis-escaped regardless of accents, quotes, or newlines in the Icelandic text.
execFileSync('open', ['-a', 'Mail', mailto])
console.log(`Opened a new Mail.app message to ${to}`)

if (revealBanner) {
  const banner = `${homedir()}/Downloads/sndr-scouting-banner.png`
  try {
    execFileSync('open', ['-R', banner])
    console.log(`Revealed the scouting banner in Finder: ${banner}`)
  } catch (e) {
    console.error(`Could not reveal the banner (not fatal): ${e.message}`)
  }
}
