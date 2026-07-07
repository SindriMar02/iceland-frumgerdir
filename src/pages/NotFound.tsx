import { useEffect } from 'react'
import { setThemeColor } from '../lib/preview'

/**
 * Neutral fallback + private-root guard.
 *
 * Rendered for (a) any unknown/stale route and (b) the hub root when it is
 * opened WITHOUT the private `?tools` flag. This page must NEVER reveal the
 * project catalogue: a business owner who follows their own preview link must
 * never be able to land on — or strip their URL down to — a page that lists the
 * other businesses. So this component names no client and links nowhere except
 * email. It is deliberately standalone (no showcase data, no catalogue nav).
 */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Sindri Már — vefhönnun'
    setThemeColor('#0b0e13')
  }, [])

  return (
    <div
      lang="is"
      className="grain flex min-h-screen items-center justify-center bg-[#0b0e13] px-6 font-sans text-white"
    >
      <main className="w-full max-w-md text-center">
        <p className="font-grotesk text-[11px] font-semibold tracking-[0.34em] text-sky-300/80 uppercase">
          Sindri Már
        </p>
        <h1 className="mt-5 font-tall text-3xl leading-tight font-normal text-balance md:text-4xl">
          Vefhönnun fyrir íslensk fyrirtæki.
        </h1>
        <p className="mx-auto mt-5 max-w-sm text-base leading-relaxed text-white/65">
          Ef þú fékkst forsýningu á vefsíðu frá mér og hlekkurinn opnast ekki, sendu mér línu — ég
          sendi þér réttan hlekk um hæl.
        </p>
        <a
          href="mailto:sindri@klubbr.is?subject=Fors%C3%BDning%20%E2%80%94%20hlekkur%20virkar%20ekki"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-sky-300 px-6 py-3 font-semibold text-slate-950 transition-colors hover:bg-sky-200"
        >
          Hafa samband
        </a>
        <p className="mt-6 text-xs text-white/35">sindri@klubbr.is</p>
      </main>
    </div>
  )
}
