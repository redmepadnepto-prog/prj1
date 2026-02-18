import { User, Mail, Shield, LogOut } from 'lucide-react'
import { blink } from '../lib/blink'
import { Button } from '../components/ui/button'

interface SettingsPageProps {
  user: { id: string; email: string; displayName?: string } | null
}

export default function SettingsPage({ user }: SettingsPageProps) {
  const initials = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? 'KU'

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-1">Settings</h1>
          <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
        </div>

        {/* Profile card */}
        <div
          className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-4 animate-fade-in"
          style={{ animationDelay: '75ms' }}
        >
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-primary-foreground text-xl font-bold"
              style={{ background: 'var(--gradient-primary)' }}
            >
              {initials}
            </div>
            <div>
              <p className="font-semibold text-foreground text-lg">{user?.displayName || 'User'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 py-3 border-t border-border">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Display Name</p>
                <p className="text-sm text-muted-foreground">{user?.displayName || 'Not set'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 border-t border-border">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 py-3 border-t border-border">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Account ID</p>
                <p className="text-sm text-muted-foreground font-mono text-xs">{user?.id?.slice(0, 20)}...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div
          className="bg-card rounded-2xl border border-border p-5 shadow-sm animate-fade-in"
          style={{ animationDelay: '150ms' }}
        >
          <h2 className="text-sm font-semibold text-foreground mb-3">Danger Zone</h2>
          <Button
            onClick={() => blink.auth.signOut()}
            variant="outline"
            className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
