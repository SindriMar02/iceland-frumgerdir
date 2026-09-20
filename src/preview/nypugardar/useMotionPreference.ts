import { useSyncExternalStore } from 'react'

const query = '(prefers-reduced-motion: reduce)'
function subscribe(onChange: () => void) {
  const media = window.matchMedia(query)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}
const snapshot = () => window.matchMedia(query).matches
// Resting markup on the server and during hydration; only then opt into motion.
// A browser preference must not change the first render's element tree.
const serverSnapshot = () => true
export function useMotionPreference() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot)
}
