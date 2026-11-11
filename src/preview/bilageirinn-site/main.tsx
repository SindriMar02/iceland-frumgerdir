import React from 'react'
import { createRoot } from 'react-dom/client'
import './site.css'
import '../../focus-guard'
import Page from './Page'

class Boundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed
      ? <main style={{ padding: '15vh 6vw', fontFamily: 'system-ui', color: '#F3F0EA', background: '#0F0D0B', minHeight: '100vh' }}><h1>Ekki tókst að opna síðuna.</h1><p>Hringdu í Bílageirann í síma 421 6901.</p></main>
      : this.props.children
  }
}
createRoot(document.getElementById('root')!).render(<Boundary><Page /></Boundary>)
