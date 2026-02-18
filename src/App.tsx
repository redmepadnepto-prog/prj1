import { useState } from 'react'
import { useAuth } from './hooks/useAuth'
import LandingPage from './pages/LandingPage'
import Sidebar from './components/layout/Sidebar'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'
import NotesPage from './pages/NotesPage'
import SettingsPage from './pages/SettingsPage'

type Page = 'dashboard' | 'tasks' | 'notes' | 'settings'

function App() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-primary-foreground font-bold text-xl animate-pulse"
            style={{ background: 'var(--gradient-primary)' }}
          >
            К
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LandingPage />
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} user={user} />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center px-6 shrink-0">
          <h2 className="font-semibold text-foreground capitalize">
            {currentPage === 'dashboard' ? 'Overview' : currentPage}
          </h2>
        </header>
        <main className="flex-1 overflow-hidden flex">
          {currentPage === 'dashboard' && <DashboardPage userId={user?.id ?? ''} />}
          {currentPage === 'tasks' && <TasksPage userId={user?.id ?? ''} />}
          {currentPage === 'notes' && <NotesPage userId={user?.id ?? ''} />}
          {currentPage === 'settings' && <SettingsPage user={user} />}
        </main>
      </div>
    </div>
  )
}

export default App
