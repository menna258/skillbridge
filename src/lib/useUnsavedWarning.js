import { useEffect } from 'react'

// Asks the browser to confirm before closing or reloading the tab while a
// form still has unsaved typing.
export default function useUnsavedWarning(dirty) {
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])
}
