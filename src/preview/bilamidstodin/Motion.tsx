import { Wordmark } from './Wordmark'

export function LoadingScreen(){
 return <div className="bm-opening" role="status" aria-live="polite" aria-busy="true"><div className="bm-opening-mark"><Wordmark/></div><div className="bm-opening-track" aria-hidden="true"><span/></div><p>Sæki söluskrá<span aria-hidden="true"> · </span><span className="bm-opening-place">Krókhálsi 7</span></p></div>
}
