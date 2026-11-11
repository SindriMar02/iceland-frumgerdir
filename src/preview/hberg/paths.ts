// Each HTML entry declares its relative route back to the deployment root.
// Resolve against the document, never against the current route or Vite's ./ base.
export const HOME = document.querySelector<HTMLMetaElement>('meta[name="hb-root"]')?.content ?? './'
export const ROOT = new URL(HOME, document.baseURI).pathname
export const PAGE = /\/naeringargildi\/$/.test(new URL('.', document.baseURI).pathname) ? 'nutrition' : /\/vorur\/$/.test(new URL('.', document.baseURI).pathname) ? 'products' : 'home'
export const pageHref = (page: string = '') => `${HOME}${page}`
export const homeAnchor = (hash: string) => PAGE === 'home' ? hash : `${HOME}${hash}`
