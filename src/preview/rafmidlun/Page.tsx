import { useParams, useSearchParams } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { CONTACT, LEAD, companyEntry as company, serviceBySlug } from './data'
import { HomeBody } from './Home'
import { HafaSamband, Jafnlaunastefna, Service, Starfsfolk, Verkbeidni } from './Pages'
import { CSS } from './styles'
import { Frame, useDoc } from './ui'

export type RafmidlunView = 'home' | 'service' | 'starfsfolk' | 'verkbeidni' | 'hafa-samband' | 'jafnlaunastefna'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Electrician',
  name: CONTACT.name,
  url: 'https://rafmidlun.is',
  telephone: '+354 540 3500',
  email: CONTACT.email,
  foundingDate: '1996',
  address: { '@type': 'PostalAddress', streetAddress: CONTACT.address, postalCode: '203', addressLocality: 'Kópavogur', addressCountry: 'IS' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], opens: '07:30', closes: '15:45' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Friday', opens: '07:30', closes: '14:00' },
  ],
}

function Doc({ view }: { view: RafmidlunView }) {
  const { slug = '' } = useParams()
  const [params] = useSearchParams()
  const s = serviceBySlug(slug)
  const job = params.get('leid') === 'umsokn'
  const t: Record<RafmidlunView, [string, string]> = {
    home: ['Rafmiðlun | Rafverktaki frá 1996', `${LEAD} Ráðgjöf, hönnun, teikningar, efnisöflun og framkvæmd, og öflug skápasmíði.`],
    service: [s ? `${s.name} | Rafmiðlun` : 'Þjónusta | Rafmiðlun', s ? s.blurb : 'Þjónusta Rafmiðlunar.'],
    starfsfolk: ['Starfsfólk | Rafmiðlun', 'Starfsfólk Rafmiðlunar: skrifstofa, verkefna- og verkstjórar, þjónusta, stóreldhústæki og verkstæði, með beinum símum og netföngum.'],
    verkbeidni: job
      ? ['Starfsumsókn | Rafmiðlun', 'Rafvirkjar og nemar sækja um hjá Rafmiðlun: nafn, netfang, kennitala og staða.']
      : ['Verkbeiðni | Rafmiðlun', 'Verkbeiðni, viðgerð á stóreldhústæki, nýtt verk eða útboð, eða starfsumsókn. Beiðnin fer á rétt netfang.'],
    'hafa-samband': ['Hafa samband | Rafmiðlun', 'Skrifstofa að Ögurhvarfi 8 í Kópavogi, þjónusta að Flugumýri 32 í Mosfellsbæ. Sími 540 3500, stóreldhústæki 540 3509.'],
    jafnlaunastefna: ['Jafnlaunastefna | Rafmiðlun', 'Jafnlaunastefna Rafmiðlunar: jöfn laun fyrir sömu eða jafnverðmæt störf, vottað jafnlaunakerfi samkvæmt ÍST 85.'],
  }
  useDoc(t[view][0], t[view][1])
  return null
}

export default function RafmidlunPage({ view = 'home' }: { view?: RafmidlunView }) {
  return (
    <div className="rm">
      {/* the two faces the hero paints with start downloading with the first render */}
      <link rel="preload" as="font" type="font/woff2" href={`${import.meta.env.BASE_URL}rafmidlun/fonts/mg-std-700.woff2`} crossOrigin="" />
      <link rel="preload" as="font" type="font/woff2" href={`${import.meta.env.BASE_URL}rafmidlun/fonts/mg-std-400.woff2`} crossOrigin="" />
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Doc view={view} />
      <PreviewChrome company={company} />
      <Frame>
        {view === 'home' && <HomeBody />}
        {view === 'service' && <Service />}
        {view === 'starfsfolk' && <Starfsfolk />}
        {view === 'verkbeidni' && <Verkbeidni />}
        {view === 'hafa-samband' && <HafaSamband />}
        {view === 'jafnlaunastefna' && <Jafnlaunastefna />}
      </Frame>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}
