/* Qualify a premium-stay lead from its own website, with evidence.
 *
 * The three things that decide whether a candidate is worth a build:
 *   1. Do they own a site at all, and what built it?
 *   2. Does it take a booking, or does every click end at Airbnb/Booking.com?
 *      (that is the commission argument, and it has to be true before it is said)
 *   3. Is there ANY structured data? Absence is the Sýnileiki pitch and it is
 *      what decides whether an AI answer engine can describe them at all.
 * Plus: is there a reachable human, since that was the bottleneck all along.
 *
 * usage: node scripts/lead-audit.mjs <domain> [<domain> ...]
 */
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36'

const get = async (url) => {
  try {
    const r = await fetch(url, { redirect: 'follow', headers: { 'user-agent': UA }, signal: AbortSignal.timeout(25000) })
    return { ok: r.ok, status: r.status, url: r.url, body: await r.text() }
  } catch (e) { return { ok: false, status: 0, url, body: '', err: e.message } }
}

const audit = async (domain) => {
  const home = await get(`https://${domain}/`)
  if (!home.body) return { domain, dead: true, err: home.err || home.status }
  const h = home.body
  const low = h.toLowerCase()

  const jsonld = [...h.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1])
  const types = new Set()
  for (const block of jsonld) {
    try {
      const j = JSON.parse(block.trim())
      const walk = (n) => {
        if (Array.isArray(n)) return n.forEach(walk)
        if (n && typeof n === 'object') {
          if (n['@type']) [].concat(n['@type']).forEach((t) => types.add(t))
          Object.values(n).forEach(walk)
        }
      }
      walk(j)
    } catch { types.add('(unparseable)') }
  }

  const engines = { 'bókun': /bokun/i, 'Booking Factory': /thebookingfactory|bookingfactory/i, Lodgify: /lodgify/i,
    Beds24: /beds24/i, Cloudbeds: /cloudbeds/i, Hostaway: /hostaway/i, Guesty: /guesty/i,
    'Little Hotelier': /littlehotelier/i, Stripe: /js\.stripe\.com/i, Siteminder: /siteminder/i }
  const engine = Object.entries(engines).filter(([, rx]) => rx.test(h)).map(([k]) => k)

  const gen = (h.match(/<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)/i) || [])[1]
    || (/wp-content|wp-includes/.test(h) ? 'WordPress (inferred)'
      : /squarespace/i.test(h) ? 'Squarespace (inferred)'
      : /wix\.com|wixstatic/i.test(h) ? 'Wix (inferred)'
      : /shopify/i.test(h) ? 'Shopify (inferred)' : '—')

  const mails = [...new Set([...h.matchAll(/mailto:([^"'?>\s]+)/gi)].map((m) => m[1]))]
  const tels = [...new Set([...h.matchAll(/tel:([^"'?>\s]+)/gi)].map((m) => m[1]))]

  // how many pages does this site actually have?
  let pages = null
  for (const sm of ['sitemap.xml', 'sitemap_index.xml', 'wp-sitemap.xml']) {
    const r = await get(`https://${domain}/${sm}`)
    if (r.ok && r.body.includes('<loc>')) {
      const locs = [...r.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
      if (locs.some((l) => /sitemap/i.test(l))) {
        let total = 0
        for (const child of locs.slice(0, 4)) {
          const c = await get(child)
          total += [...c.body.matchAll(/<loc>/g)].length
        }
        pages = total || locs.length
      } else pages = locs.length
      break
    }
  }

  return {
    domain, dead: false, status: home.status, finalUrl: home.url,
    title: (h.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1]?.trim().slice(0, 70) || '(none)',
    desc: (h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i) || [])[1]?.slice(0, 90) || '(none)',
    schema: types.size ? [...types].join(', ') : 'NONE',
    engine: engine.length ? engine.join(', ') : 'none found',
    /* Match LINKS, never the bare word. A substring check called three sites
       "funnels to Airbnb" when the word only appeared inside a quoted guest
       review ("one of the cleanest airbnbs I've stayed in"). An OTA funnel is
       an anchor pointing at the OTA, nothing else. */
    funnels: [...new Set([...h.matchAll(/<a[^>]+href=["'](https?:\/\/[^"']+)["']/gi)]
      .map((m) => m[1])
      .map((u) => /airbnb\./i.test(u) ? 'Airbnb' : /booking\.com/i.test(u) ? 'Booking.com'
        : /vrbo\./i.test(u) ? 'Vrbo' : /guidetoiceland/i.test(u) ? 'GuideToIceland' : null)
      .filter(Boolean))],
    gen, mails, tels, pages, bytes: h.length,
  }
}

const domains = process.argv.slice(2)
for (const d of domains) {
  const a = await audit(d)
  console.log(`\n████ ${d}`)
  if (a.dead) { console.log(`   DEAD / unreachable: ${a.err}`); continue }
  console.log(`   title      ${a.title}`)
  console.log(`   meta desc  ${a.desc}`)
  console.log(`   built with ${a.gen}`)
  console.log(`   pages      ${a.pages ?? 'no sitemap'}`)
  console.log(`   SCHEMA     ${a.schema}   ${a.schema === 'NONE' ? '  ← invisible to AI answer engines' : ''}`)
  console.log(`   booking    ${a.engine}`)
  console.log(`   funnels to ${a.funnels.length ? a.funnels.join(', ') : 'nothing (self-contained)'}`)
  console.log(`   contact    ${a.mails.length ? a.mails.join(', ') : 'no mailto'}${a.tels.length ? '  ·  ' + a.tels.join(', ') : ''}`)
}
