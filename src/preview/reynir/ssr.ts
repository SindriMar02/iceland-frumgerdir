/**
 * Helpers for the pages that are prerendered at build time.
 *
 * The site is rendered to real HTML by tools/reynir-prerender.mjs and hydrated
 * in the browser, which means every component now runs twice: once in Node,
 * once in the browser. useLayoutEffect does not exist meaningfully in Node and
 * React logs a warning for it, so it degrades to useEffect there.
 *
 * Use this, not useLayoutEffect, for anything that must settle before the
 * first paint — a curtain, a measured layout, a scroll position.
 */
import { useEffect, useLayoutEffect } from 'react'

export const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect
