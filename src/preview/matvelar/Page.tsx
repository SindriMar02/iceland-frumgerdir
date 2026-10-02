import { useParams } from 'react-router-dom'
import { PreviewChrome } from '../PreviewChrome'
import { PreviewFooter } from '../PreviewFooter'
import { CONTACT, companyEntry as company, familyBySlug } from './data'
import { HomeBody } from './Home'
import { Family, Fyrirspurn, Thjonusta, Velar } from './Pages'
import { ListProvider } from './store'
import { CSS } from './styles'
import { Frame, useDoc } from './ui'

export type MatvelarView = 'home' | 'velar' | 'family' | 'thjonusta' | 'fyrirspurn'

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: CONTACT.name,
  url: 'https://matvelar.is',
  telephone: '+354 899 6716',
  email: CONTACT.email,
  vatID: `IS${CONTACT.vsk}`,
  address: { '@type': 'PostalAddress', streetAddress: CONTACT.address, postalCode: '210', addressLocality: 'Garðabær', addressCountry: 'IS' },
}

function Doc({ view }: { view: MatvelarView }) {
  const { slug = '' } = useParams()
  const fam = familyBySlug(slug)
  const t: Record<MatvelarView, [string, string]> = {
    home: ['Matvélar og umbúðir ehf. | Vélar og þjónusta fyrir matvælaiðnaðinn', 'Matvélar og umbúðir selja og þjónusta vélar fyrir kjötvinnslur, fiskvinnslur, kjúklingaframleiðendur, iðnaðarbakarí og mjólkuriðnaðinn, frá forvinnslu til pökkunar.'],
    velar: ['Vélar og umbúðir eftir skrefum | Matvélar og umbúðir', 'Hakkavélar, farsvélar, formunarvélar, pylsusprautur, reykofnar, pökkunarvélar og umbúðir frá sjö framleiðendum. Veldu skref í framleiðslunni.'],
    family: [fam ? `${fam.name} | Matvélar og umbúðir` : 'Vélar | Matvélar og umbúðir', fam ? `Við seljum ${fam.sell} frá ${fam.suppliers.length > 1 ? 'tveimur framleiðendum' : 'einum framleiðanda'}. Sjáðu hvar vélin á heima í framleiðslulínunni og sendu fyrirspurn.` : 'Vélar frá Matvélum og umbúðum.'],
    thjonusta: ['Þjónusta og varahlutir | Matvélar og umbúðir', 'Bilun, varahlutir, viðhald, uppsetning og kennsla á vélum. Sendu gerð, raðnúmer og mynd, eða hringdu í Pál í Matvélum eða Rúnar í KAPP.'],
    fyrirspurn: ['Senda fyrirspurn | Matvélar og umbúðir', 'Ný vél, ráðgjöf eða vél í notkun. Fyrirspurnin verður tilbúin með öllu sem þarf til að svara.'],
  }
  useDoc(t[view][0], t[view][1])
  return null
}

export default function MatvelarPage({ view = 'home' }: { view?: MatvelarView }) {
  return (
    <div className="mv">
      <style>{CSS}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      <Doc view={view} />
      <PreviewChrome company={company} />
      <ListProvider>
        <Frame>
          {view === 'home' && <HomeBody />}
          {view === 'velar' && <Velar />}
          {view === 'family' && <Family />}
          {view === 'thjonusta' && <Thjonusta />}
          {view === 'fyrirspurn' && <Fyrirspurn />}
        </Frame>
      </ListProvider>
      <PreviewFooter company={company} verifiedContent />
    </div>
  )
}

