import { useEffect, useState } from 'react'

// Shows a short loading state whenever the filter key changes, so results
// visibly refresh after a search or filter change.
export default function useFilteredLoading(key, ms = 350) {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const id = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(id)
  }, [key, ms])
  return loading
}
