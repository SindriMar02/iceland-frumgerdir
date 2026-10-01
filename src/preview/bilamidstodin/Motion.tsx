import { Wordmark } from './Wordmark'

export function LoadingScreen(){
 return <div className="bm-opening" role="status" aria-live="polite" aria-busy="true" aria-label="Sæki söluskrá"><div className="bm-opening-mark"><Wordmark/></div><div className="bm-opening-track" aria-hidden="true"><span/></div></div>
}
