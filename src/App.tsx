import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'

const Home = lazy(() => import('./pages/Home'))
const IceTourism = lazy(() => import('./pages/IceTourism'))
const DaeliFarm = lazy(() => import('./pages/DaeliFarm'))
const Eldhestar = lazy(() => import('./pages/Eldhestar'))
const GuesthouseCarina = lazy(() => import('./pages/GuesthouseCarina'))
const GJTravel = lazy(() => import('./pages/GJTravel'))
const Fimm = lazy(() => import('./pages/Fimm'))

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
            <Route path="/" element={<Home />} />
            <Route path="/ice-tourism" element={<IceTourism />} />
            <Route path="/daeli-farm" element={<DaeliFarm />} />
            <Route path="/eldhestar" element={<Eldhestar />} />
            <Route path="/guesthouse-carina" element={<GuesthouseCarina />} />
            <Route path="/gj-travel" element={<GJTravel />} />
            <Route path="/fimm" element={<Fimm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MotionConfig>
  )
}
