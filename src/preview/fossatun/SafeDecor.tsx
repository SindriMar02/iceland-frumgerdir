/**
 * A boundary around decorative flourishes.
 *
 * A typo inside the 3D drums threw during mount and React unmounted the WHOLE
 * page: a client's site went completely blank because an ornament failed. That
 * is never an acceptable failure mode for a decorative element, so anything
 * non-essential renders inside this, and a crash falls back to the plain
 * version instead of taking the site with it.
 *
 * It deliberately does not retry. If the fancy version is broken, the quiet
 * version is what the visitor should keep seeing.
 */

import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  /** Rendered instead if the children throw. */
  fallback: ReactNode
}

export class SafeDecor extends Component<Props, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(err: unknown) {
    // surfaced in the console for us, invisible to the visitor
    console.warn('[fossatun] decorative element failed, using the plain version', err)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
