/**
 * Image paths only. Split out of `./data` so the eager loading curtain
 * (imported synchronously by App.tsx as this route's Suspense fallback) does
 * not drag Samverk's contact details and copy into the shared entry chunk
 * every other route downloads — see [[preview-link-isolation]].
 */
const A = `${import.meta.env.BASE_URL}img/samverk/`

export const IMG = {
  logo: `${A}logo.png`,
  glerveggur: `${A}glerveggur.jpg`,
  sturtugler: `${A}sturtugler.jpg`,
  glerhandrid: `${A}glerhandrid.jpg`,
  speglar: `${A}speglar.jpg`,
}
