/**
 * Öruggt skjól — landing page.
 *
 * Rebuilt 2026-09-17 as eight chapters that alternate between the painted,
 * serif "shelter" register and the white, sans "guidance" register, so no
 * two neighbouring sections share a layout. The chapters live in
 * landing.tsx; the sections that left this page (statistics, FAQ, related
 * institutions, the full news list, the timeline) live on their own pages.
 *
 * Native scroll only; every reveal is transform/opacity and reduced-motion
 * safe. The one ambient loop on the site is the hero's drifting mist.
 */

import { useEffect } from 'react'
import { setThemeColor } from '../../lib/preview'
import { BofsStyles, C, Footer, Header, useLang } from './ui'
import { UI } from './data'
import { DuskBookend } from './sections'
import { ChapterMark, Ending, Entrances, Grounds, HelpPanel, Hero, Process, ServiceCategories, Story } from './landing'

export default function BofsPage() {
  const [, , pick] = useLang()

  useEffect(() => {
    document.title = 'Öruggt skjól | Barna- og fjölskyldustofa'
    setThemeColor(C.cream)
  }, [])

  const chapters = [
    { id: 'byrja', label: pick({ is: 'Hvar byrjar þú', en: 'Where to start' }) },
    { id: 'saga', label: pick({ is: 'Ein saga', en: 'One story' }) },
    { id: 'heimili', label: pick({ is: 'Meðferðarheimili', en: 'Treatment homes' }) },
    { id: 'thjonusta', label: pick({ is: 'Stuðningsþjónusta', en: 'Support services' }) },
    { id: 'ferli', label: pick({ is: 'Hvernig hjálpin virkar', en: 'How help works' }) },
    { id: 'stadir', label: pick({ is: 'Staðirnir', en: 'The places' }) },
    { id: 'help', label: pick({ is: 'Hjálp núna', en: 'Help now' }) },
    { id: 'um', label: pick({ is: 'Stofnunin', en: 'The agency' }) },
  ]

  return (
    <div className="bofs-root min-h-screen overflow-x-clip">
      <BofsStyles />
      <Header />
      <a href="#main" className="sr-only focus:not-sr-only">
        {pick(UI.skipToContent)}
      </a>

      <main id="main">
        <Hero />
        <Entrances />
        <Story />
        <ServiceCategories />
        <Process />
        <Grounds />
        <HelpPanel />
        <Ending />
        <DuskBookend />
      </main>
      <ChapterMark chapters={chapters} />

      <Footer />
    </div>
  )
}
