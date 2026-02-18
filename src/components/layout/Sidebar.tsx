import { CheckSquare, FileText, LayoutDashboard, Settings, LogOut, ChevronRight } from 'lucide-react'
import { blink } from '../../lib/blink'

type Page = 'dashboard' | 'tasks' | 'notes' | 'settings'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  user: { email: string; displayName?: string } | null
}

const navItems = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks' as Page, label: 'Tasks', icon: CheckSquare },
  { id: 'notes' as Page, label: 'Notes', icon: FileText },
  { id: 'settings' as Page, label: 'Settings', icon: Settings },
]

export default function Sidebar({ currentPage, onNavigate, user }: SidebarProps) {
  const handleLogout = async () => {
    await blink.auth.signOut()
  }

  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'KU'

  return (
    <aside className="w-60 h-screen flex flex-col bg-[hsl(var(--sidebar))] border-r border-[hsl(var(--sidebar-border))]">
      {/* Logo */}
      <div className="h-16 flex items-center px-5 border-b border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0"
            style={{ background: 'var(--gradient-primary)' }}
          >
            К
          </div>
          <span className="font-serif font-semibold text-[hsl(var(--sidebar-foreground))] text-base tracking-tight">
            Ku Helper
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = currentPage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-[hsl(var(--sidebar-foreground))] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-accent-foreground))]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-primary-foreground/60" />}
            </button>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-[hsl(var(--sidebar-border))]">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[hsl(var(--sidebar-accent))] mb-1">
          <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[hsl(var(--sidebar-foreground))] truncate">
              {user?.displayName || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors duration-150"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  )
}
