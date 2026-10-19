import { useParams } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { CONTACT, GROUP, companyEntry as company, familyBySlug, sectorBySlug } from './data'
import { HomeBody } from './Home'
import { Family, Fyrirspurn, Merkingar, Sector, Thjonusta, Velar } from './Pages'
import { ListProvider } from './store'
import { CSS } from './styles'
import { Frame, useDoc } from './ui'

export type SamhentirView = 'home' | 'velar' | 'family' | 'sector' | 'merkingar' | 'thjonusta' | 'fyrirspurn'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: CONTACT.name,
  url: 'https://samhentir.is',
  telephone: '+354 575 8000',
  email: CONTACT.email,
  foundingDate: '1996',
  address: { '@type': 'PostalAddress', streetAddress: CONTACT.address, postalCode: '210', addressLocality: 'Garðabær', addressCountry: 'IS' },
  subOrganization: GROUP.filter((g) => g.id !== 'samhentir').map((g) => ({ '@type': 'Organization', name: g.name, url: g.url, telephone: `+354 ${g.phone}` })),
}

function Doc({ view }: { view: SamhentirView }) {
  const { slug = '' } = useParams()
  const fam = familyBySlug(slug)
  const sec = sectorBySlug(slug)
  const t: Record<SamhentirView, [string, string]> = {
    home: ['Samhentir | Umbúðir, merkingar og vélar fyrir framleiðslu', 'Samhentir, Vörumerking, Plastco og Formar: umbúðir, merkingar og vélar fyrir sjávarútveg, matvælaiðnað og aðrar greinar, frá vinnslulínunni að brettinu.'],
    velar: ['Vélar og búnaður | Samhentir', 'Pökkunarvélar, vogir, prentarar, kassavélar, brettavafning og þjarkar frá Samhentum og Plastco, eftir skrefum í línunni.'],
    family: [fam ? `${fam.name} | Samhentir` : 'Vélar | Samhentir', fam ? `${fam.blurb} Sjáðu gerðirnar og hvar vélin á heima í línunni.` : 'Vélar frá Samhentum.'],
    sector: [sec ? `Umbúðir og vélar fyrir ${sec.for} | Samhentir` : 'Atvinnugreinar | Samhentir', sec ? sec.lead : 'Atvinnugreinar sem Samhentir þjóna.'],
    merkingar: ['Merkingar og límmiðar | Vörumerking, Samhentir', 'Límmiðar í allt að 12 litum, stafræn prentun, állok, álþynnur, áprentuð pökkunarfilma og plastkort frá Vörumerkingu.'],
    thjonusta: ['Viðgerðir og varahlutir | Samhentir', 'Þjónustubeiðni fyrir vélar frá Samhentum og Plastco: gerð, raðnúmer, þjónustusamningur og mynd. Símar utan opnunartíma.'],
    fyrirspurn: ['Senda fyrirspurn | Samhentir', 'Umbúðir, vélar, þjónusta eða merkingar. Fyrirspurnin verður tilbúin með öllu sem þarf til að svara og ratar á réttan stað.'],
  }
  useDoc(t[view][0], t[view][1])
  return null
}

export default function SamhentirPage({ view = 'home' }: { view?: SamhentirView }) {
  return (
    <div className="sh">
      {/* the two faces the hero paints with start downloading with the first render */}
      <link rel="preload" as="font" type="font/woff2" href={`${import.meta.env.BASE_URL}samhentir/fonts/mg-wd-700.woff2`} crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href={`${import.meta.env.BASE_URL}samhentir/fonts/mg-std-400.woff2`} crossOrigin="" />
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Doc view={view} />
      <PreviewChrome company={company} />
      <ListProvider>
        <Frame>
          {view === 'home' && <HomeBody />}
          {view === 'velar' && <Velar />}
          {view === 'family' && <Family />}
          {view === 'sector' && <Sector />}
          {view === 'merkingar' && <Merkingar />}
          {view === 'thjonusta' && <Thjonusta />}
          {view === 'fyrirspurn' && <Fyrirspurn />}
        </Frame>
      </ListProvider>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
