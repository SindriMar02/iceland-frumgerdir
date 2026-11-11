import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createElement, lazy, Suspense } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { renderMarkup } from '../src/preview/polarhestar/prerenderStream.mjs'

test('multibyte text at every buffer boundary remains exact and NUL-free', async () => {
  // Small chunks place the date text across the old Node writer's 2048-byte
  // boundary. A single long string bypasses that writer path and misses the bug.
  for (let n = 1900; n < 2070; n++) {
    const chunks = Array.from({ length: Math.floor(n / 500) }, (_, i) =>
      createElement('span', { key: i }, 'a'.repeat(500)))
    chunks.push(createElement('span', { key: 'tail' }, 'a'.repeat(n % 500)))
    chunks.push(createElement('p', { key: 'date', title: 'July 7–14 · Fully booked' }, 'Mættu 30 mínútum 🐴'))
    const element = createElement('div', null, ...chunks)
    const html = await renderMarkup(element)
    assert.equal(html, renderToStaticMarkup(element))
    assert(!html.includes('\x00'))
  }
})

test('prerender waits for lazy content and never emits the Suspense fallback', async () => {
  const Page = lazy(async () => ({ default: () => createElement('h1', null, 'Grýtubakki') }))
  const html = await renderMarkup(createElement(Suspense, { fallback: 'LOADING' }, createElement(Page)))
  assert(html.includes('<h1>Grýtubakki</h1>'))
  assert(!html.includes('LOADING'))
})

test('render errors reject instead of shipping a fallback', async () => {
  function Broken() { throw new Error('expected render failure') }
  await assert.rejects(renderMarkup(createElement(Broken)), /expected render failure/)
})
