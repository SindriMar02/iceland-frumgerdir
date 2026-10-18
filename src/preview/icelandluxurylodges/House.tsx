import { Navigate, useParams } from 'react-router-dom'
import Page from './Page'
import { DOORS } from './data'

/* One page per house: /preview/icelandluxurylodges/<house>. Keyed by the house
   so moving between two house pages remounts the page (fresh reveal, fresh
   scroll engine) instead of patching one house's DOM into another's. */
export default function House() {
  const { house = '' } = useParams()
  if (!DOORS.some((d) => d.id === house)) return <Navigate to="/preview/icelandluxurylodges" replace />
  return <Page key={house} house={house} />
}
