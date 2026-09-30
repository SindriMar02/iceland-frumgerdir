import React from 'react'
import { createRoot } from 'react-dom/client'
import Page from './Page'
import './styles.css'
class Boundary extends React.Component<{children: React.ReactNode},{failed:boolean}> {
 state={failed:false}
 static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<main className="bg-fatal"><h1>Ekki tókst að opna síðuna.</h1><p>Reyndu aftur eða hafðu samband við Bílagallerí í síma 554 6700.</p><button onClick={()=>location.reload()}>Reyna aftur</button><a href="https://www.bilagalleri.is/">Opna núverandi vef</a></main>:this.props.children}
}
createRoot(document.getElementById('root')!).render(<Boundary><Page/></Boundary>)
