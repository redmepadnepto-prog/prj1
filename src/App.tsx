import { useState, useEffect } from 'react'
import KeyEntryScreen from './components/KeyEntryScreen'
import MainApp from './components/MainApp'

const STORAGE_KEY = 'dentyuss_key_activated'

function App() {
  const [activated, setActivated] = useState<boolean | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    setActivated(saved === 'true')
  }, [])

  const handleActivate = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setActivated(true)
  }

  const handleDeactivate = () => {
    localStorage.removeItem(STORAGE_KEY)
    setActivated(false)
  }

  // Loading while checking localStorage
  if (activated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
          style={{ borderTopColor: 'hsl(195 100% 50%)' }}
        />
      </div>
    )
  }

  if (activated) {
    return <MainApp onDeactivate={handleDeactivate} />
  }

  return <KeyEntryScreen onActivate={handleActivate} />
}

export default App
