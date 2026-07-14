import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'

// Eager (not lazy): the universal fallback must always be available, even if a
// route chunk is stale or 404s. It names no client and never links to the hub.
import NotFound from './pages/NotFound'
// Eager: shown as this route's OWN Suspense fallback while its chunk downloads, so it must be
// available synchronously - a lazy-loaded fallback can't render before its own chunk has loaded.
import FlatbakanLoading from './preview/flatbakan/Loading'
import EldofninnLoading from './preview/eldofninn/Loading'
import PizzasmidjanLoading from './preview/pizzasmidjan/Loading'
import AskurLoading from './preview/askur/Loading'
import SmariholmLoading from './preview/smariholm/Loading'
import SamverkLoading from './preview/samverk/Loading'

const Home = lazy(() => import('./pages/Home'))
const IceTourism = lazy(() => import('./pages/IceTourism'))
const DaeliFarm = lazy(() => import('./pages/DaeliFarm'))
const Eldhestar = lazy(() => import('./pages/Eldhestar'))
const GuesthouseCarina = lazy(() => import('./pages/GuesthouseCarina'))
const GJTravel = lazy(() => import('./pages/GJTravel'))

// Five independent redesign projects (new client engagements)
const AdminPreviews = lazy(() => import('./preview/AdminPreviews'))
const Outreach = lazy(() => import('./pages/Outreach'))
const ErpsstadirPage = lazy(() => import('./preview/erpsstadir/Page'))
const TjoruhusidPage = lazy(() => import('./preview/tjoruhusid/Page'))
const EktafiskurPage = lazy(() => import('./preview/ektafiskur/Page'))
const KaffiHornidPage = lazy(() => import('./preview/kaffihornid/Page'))
const SeaKayakPage = lazy(() => import('./preview/seakayak/Page'))
const WeiderPage = lazy(() => import('./preview/weider/Page'))
// Batch 3 — five new redesigns
const AustriPage = lazy(() => import('./preview/austri/Page'))
const LysulaugarPage = lazy(() => import('./preview/lysulaugar/Page'))
const HespaPage = lazy(() => import('./preview/hespa/Page'))
const ReykkofinnPage = lazy(() => import('./preview/reykkofinn/Page'))
const GaldrasyningPage = lazy(() => import('./preview/galdrasyning/Page'))
// Batch 4 — five new redesigns
const SaudarkroksbakariPage = lazy(() => import('./preview/saudarkroksbakari/Page'))
const ReykjavikDistilleryPage = lazy(() => import('./preview/reykjavikdistillery/Page'))
const BeffaToursPage = lazy(() => import('./preview/beffatours/Page'))
const KoggaPage = lazy(() => import('./preview/kogga/Page'))
const HaafellPage = lazy(() => import('./preview/haafell/Page'))
const PolarHestarPage = lazy(() => import('./preview/polarhestar/Page'))
const EyjatoursPage = lazy(() => import('./preview/eyjatours/Page'))
// Batch 5 — five new redesigns (scout round 5)
const FischerseturPage = lazy(() => import('./preview/fischersetur/Page'))
const EdinborgPage = lazy(() => import('./preview/edinborg/Page'))
const BrunastadirPage = lazy(() => import('./preview/brunastadir/Page'))
const GlacierParadisePage = lazy(() => import('./preview/glacierparadise/Page'))
const SireksstadirPage = lazy(() => import('./preview/sireksstadir/Page'))
// Batch 6 — three South-Iceland builds (under Eyjafjallajökull)
const CavesOfHellaPage = lazy(() => import('./preview/cavesofhella/Page'))
const GamlaFjosidPage = lazy(() => import('./preview/gamlafjosid/Page'))
const FaxiBakeryPage = lazy(() => import('./preview/faxibakery/Page'))
const KirkjubaerPage = lazy(() => import('./preview/kirkjubaer/Page'))
// Scout round 6 — two rural farm guesthouses (shared "Mutafova" editorial DNA)
const VinlandPage = lazy(() => import('./preview/vinland/Page'))
const VellirPage = lazy(() => import('./preview/vellir/Page'))
// Scout round 7 — bakeries; reuses the Faxi Bakery Café design system
const GkBakariPage = lazy(() => import('./preview/gkbakari/Page'))
const RakarastofaPage = lazy(() => import('./preview/rakarastofa/Page'))
// Bakery scout round 8 — Passion Reykjavík (GK skeleton, their own dark-gold brand)
const PassionPage = lazy(() => import('./preview/passion/Page'))
// Reynir bakari — clones the Passion design + palette, re-skinned to their brand
const ReynirPage = lazy(() => import('./preview/reynir/Page'))
// Standalone lead — e-commerce showroom redesign (Shopify-migratable)
const HeitirpottarPage = lazy(() => import('./preview/heitirpottar/Page'))
const HeitirpottarStock = lazy(() => import('./preview/heitirpottar/Stock'))
const SportsolPage = lazy(() => import('./preview/sportsol/Page'))
const StjornusolPage = lazy(() => import('./preview/stjornusol/Page'))
const SaelanPage = lazy(() => import('./preview/saelan/Page'))
const ArsolPage = lazy(() => import('./preview/arsol/Page'))
const StrytanPage = lazy(() => import('./preview/strytan/Page'))
// Seiðkarlinn — natural-products apothecary, "Galdrabókin" concept
const SeidkarlinnPage = lazy(() => import('./preview/seidkarlinn/Page'))
// Concept — Barna- og fjölskyldustofa "Öruggt skjól" (warm umbrella, per-centre pages)
const BofsPage = lazy(() => import('./preview/bofs/Page'))
const BofsCentre = lazy(() => import('./preview/bofs/Centre'))
const FlatbakanPage = lazy(() => import('./preview/flatbakan/Page'))
// Eldofninn — clones the flatbakan redesign's exact template, re-skinned to this brand
const EldofninnPage = lazy(() => import('./preview/eldofninn/Page'))
// Pizzasmiðjan (Akureyri) — clones the same template, re-skinned to this brand
const PizzasmidjanPage = lazy(() => import('./preview/pizzasmidjan/Page'))
// Askur Pizzeria (Egilsstaðir) — same template, DARK reskin to their black/white brand
const AskurPage = lazy(() => import('./preview/askur/Page'))
// Prolan Bílaryðvörn Hjá Smára Hólm (Hafnarfjörður) — "Brynja" concept, own build (not a clone)
const SmariholmPage = lazy(() => import('./preview/smariholm/Page'))
// Glerverksmiðjan Samverk (Kópavogur/Hella) — "Ljósbrot" concept, own build
const SamverkPage = lazy(() => import('./preview/samverk/Page'))
// Bílageirinn — Reykjanesbær auto body shop, "True Line" aviation-precision concept
const BilageirinnPage = lazy(() => import('./preview/bilageirinn/Page'))
// Prentverk Selfoss — print shop, "Yfirprent" two-colour overprint concept
const PrentverkPage = lazy(() => import('./preview/prentverk/Page'))
// Gleraugnasalan Geisli — Akureyri optician, "Gleraugu eru skart" jewelry-focus concept
const GeisliPage = lazy(() => import('./preview/geisli/Page'))
// Pípulagnir Suðurlands — Selfoss plumbing, "Heitt og kalt" tap-marker duality concept
const PipulagnirPage = lazy(() => import('./preview/pipulagnir/Page'))
const Comparison = lazy(() => import('./preview/Comparison'))

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // honor deep links like /eldhestar#rides (lazy routes mount after the
      // browser's native anchor jump, so do it ourselves)
      document.querySelector(hash)?.scrollIntoView()
      return
    }
    // 'instant' so route changes don't animate through the smooth-scroll CSS
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname, hash])
  return null
}

/** Sindri's private hub flag, read from the URL (same check the hub itself uses). */
function toolsEnabled(): boolean {
  try {
    return new URLSearchParams(window.location.search).has('tools')
  } catch {
    return false
  }
}

/**
 * The hub root is private. With ?tools it shows Sindri's full project
 * catalogue; without it, the neutral page — so a business owner who strips
 * their own preview link down to the root can never see the other businesses.
 */
function RootRoute() {
  return toolsEnabled() ? <Home /> : <NotFound />
}

// Router must agree with Vite's base when deployed under a subpath
const BASE = import.meta.env.BASE_URL
const basename = BASE === '/' ? undefined : BASE.replace(/\/$/, '')

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={basename}>
        <ScrollToTop />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<RootRoute />} />
            <Route path="/ice-tourism" element={<IceTourism />} />
            <Route path="/daeli-farm" element={<DaeliFarm />} />
            <Route path="/eldhestar" element={<Eldhestar />} />
            <Route path="/guesthouse-carina" element={<GuesthouseCarina />} />
            <Route path="/gj-travel" element={<GJTravel />} />
            {/* Five independent redesign projects + internal dashboard */}
            <Route path="/admin/previews" element={<AdminPreviews />} />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/preview/erpsstadir" element={<ErpsstadirPage />} />
            <Route path="/preview/tjoruhusid" element={<TjoruhusidPage />} />
            <Route path="/preview/ektafiskur" element={<EktafiskurPage />} />
            <Route path="/preview/kaffihornid" element={<KaffiHornidPage />} />
            <Route path="/preview/seakayak" element={<SeaKayakPage />} />
            <Route path="/preview/weider" element={<WeiderPage />} />
            <Route path="/preview/austri" element={<AustriPage />} />
            <Route path="/preview/lysulaugar" element={<LysulaugarPage />} />
            <Route path="/preview/hespa" element={<HespaPage />} />
            <Route path="/preview/reykkofinn" element={<ReykkofinnPage />} />
            <Route path="/preview/galdrasyning" element={<GaldrasyningPage />} />
            <Route path="/preview/saudarkroksbakari" element={<SaudarkroksbakariPage />} />
            <Route path="/preview/reykjavikdistillery" element={<ReykjavikDistilleryPage />} />
            <Route path="/preview/beffatours" element={<BeffaToursPage />} />
            <Route path="/preview/kogga" element={<KoggaPage />} />
            <Route path="/preview/haafell" element={<HaafellPage />} />
            <Route path="/preview/polarhestar" element={<PolarHestarPage />} />
            <Route path="/preview/eyjatours" element={<EyjatoursPage />} />
            <Route path="/preview/fischersetur" element={<FischerseturPage />} />
            <Route path="/preview/edinborg" element={<EdinborgPage />} />
            <Route path="/preview/brunastadir" element={<BrunastadirPage />} />
            <Route path="/preview/glacierparadise" element={<GlacierParadisePage />} />
            <Route path="/preview/sireksstadir" element={<SireksstadirPage />} />
            <Route path="/preview/cavesofhella" element={<CavesOfHellaPage />} />
            <Route path="/preview/gamlafjosid" element={<GamlaFjosidPage />} />
            <Route path="/preview/faxibakery" element={<FaxiBakeryPage />} />
            <Route path="/preview/kirkjubaer" element={<KirkjubaerPage />} />
            <Route path="/preview/vinland" element={<VinlandPage />} />
            <Route path="/preview/vellir" element={<VellirPage />} />
            <Route path="/preview/gkbakari" element={<GkBakariPage />} />
            <Route path="/preview/rakarastofa" element={<RakarastofaPage />} />
            <Route path="/preview/passion" element={<PassionPage />} />
            <Route path="/preview/reynir" element={<ReynirPage />} />
            <Route path="/preview/heitirpottar" element={<HeitirpottarPage />} />
            <Route path="/preview/heitirpottar/lager" element={<HeitirpottarStock />} />
            <Route path="/preview/sportsol" element={<SportsolPage />} />
            <Route path="/preview/stjornusol" element={<StjornusolPage />} />
            <Route path="/preview/saelan" element={<SaelanPage />} />
            <Route path="/preview/arsol" element={<ArsolPage />} />
            <Route path="/preview/strytan" element={<StrytanPage />} />
            <Route path="/preview/seidkarlinn" element={<SeidkarlinnPage />} />
            <Route path="/preview/bofs" element={<BofsPage />} />
            <Route path="/preview/bofs/:slug" element={<BofsCentre />} />
            {/* own nested Suspense (not the outer fallback=null) so a slow chunk fetch shows a
                branded loading screen instead of a blank flash - see Loading.tsx */}
            <Route path="/preview/flatbakan" element={<Suspense fallback={<FlatbakanLoading />}><FlatbakanPage /></Suspense>} />
            <Route path="/preview/eldofninn" element={<Suspense fallback={<EldofninnLoading />}><EldofninnPage /></Suspense>} />
            <Route path="/preview/pizzasmidjan" element={<Suspense fallback={<PizzasmidjanLoading />}><PizzasmidjanPage /></Suspense>} />
            <Route path="/preview/askur" element={<Suspense fallback={<AskurLoading />}><AskurPage /></Suspense>} />
            <Route path="/preview/smariholm" element={<Suspense fallback={<SmariholmLoading />}><SmariholmPage /></Suspense>} />
            <Route path="/preview/samverk" element={<Suspense fallback={<SamverkLoading />}><SamverkPage /></Suspense>} />
            <Route path="/preview/bilageirinn" element={<BilageirinnPage />} />
            <Route path="/preview/prentverk" element={<PrentverkPage />} />
            <Route path="/preview/geisli" element={<GeisliPage />} />
            <Route path="/preview/pipulagnir" element={<PipulagnirPage />} />
            <Route path="/preview/comparison" element={<Comparison />} />
            {/* Unknown/stale routes → neutral page. NEVER redirect to the
                catalogue: that is exactly how owners ended up seeing it. */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  )
}
