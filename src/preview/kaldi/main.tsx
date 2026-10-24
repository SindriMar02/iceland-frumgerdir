import React from 'react'
import { createRoot } from 'react-dom/client'
import Page from './Page'
import '../../focus-guard'

class Boundary extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    return this.state.failed
      ? <main style={{ padding: '15vh 6vw', fontFamily: 'system-ui', color: '#1C130D' }}><h1>Ekki tókst að opna síðuna.</h1><p>Reyndu aftur eða hafðu samband við Bruggsmiðjuna Kalda í síma 466 2505.</p><button onClick={() => location.reload()}>Reyna aftur</button></main>
      : this.props.children
  }
}
createRoot(document.getElementById('root')!).render(<Boundary><Page /></Boundary>)
