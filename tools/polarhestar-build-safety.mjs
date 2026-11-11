/** Pure release checks shared by postbuild and focused regression tests. */
export function analyticsShell(html, { token, noindex }) {
  if (token && !noindex) {
    html = html.replace('__CF_ANALYTICS_TOKEN__', () => token)
  } else {
    html = html.replace(/\s*<script[^>]+src="https:\/\/static\.cloudflareinsights\.com\/beacon\.min\.js"[^>]*><\/script>/g, '')
  }
  if (noindex) html = html.replace(/\s*<script[^>]+data-site="polarhestar"[^>]*><\/script>/g, '')
  return html
}

export function firstControl(bytes) {
  for (let i = 0; i < bytes.length; i++) {
    if (bytes[i] < 32 && ![9, 10, 13].includes(bytes[i])) return i
  }
  return -1
}
