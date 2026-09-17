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
import { BofsStyles, C, Header, useLang } from './ui'
import { UI } from './data'
import { ChapterBreak, ChapterMark, Ending, Entrances, Grounds, HelpPanel, Hero, NightClose, Process, ServiceCategories, Story } from './landing'

export default function BofsPage() {
  const [, , pick] = useLang()

  useEffect(() => {
    document.title = 'Öruggt skjól | Barna- og fjölskyldustofa'
    setThemeColor(C.cream)
  }, [])

  const chapters = [
    { id: 'byrja', label: pick({ is: 'Hvar á að byrja', en: 'Where to start' }) },
    { id: 'saga', label: pick({ is: 'Dæmi', en: 'Example' }) },
    { id: 'heimili', label: pick({ is: 'Meðferðarheimili', en: 'Treatment homes' }) },
    { id: 'thjonusta', label: pick({ is: 'Þjónusta', en: 'Services' }) },
    { id: 'ferli', label: pick({ is: 'Ferlið', en: 'The process' }) },
    { id: 'stadir', label: pick({ is: 'Heimilin', en: 'The homes' }) },
    { id: 'help', label: pick({ is: 'Hjálp', en: 'Help' }) },
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
        <ChapterBreak n={1} word={{ is: 'Ferill máls', en: 'A case' }} ground={C.cream2} />
        <Story />
        <ChapterBreak n={2} word={{ is: 'Úrræðin', en: 'Services' }} />
        <ServiceCategories />
        <ChapterBreak n={3} word={{ is: 'Ferlið', en: 'Process' }} ground="#FFFFFF" />
        <Process />
        <Grounds />
        <ChapterBreak n={4} word={{ is: 'Hjálp', en: 'Help' }} ground={C.cream2} />
        <HelpPanel />
        <Ending />
        <NightClose />
      </main>
      <ChapterMark chapters={chapters} />
    </div>
  )
}
