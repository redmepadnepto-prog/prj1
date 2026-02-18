import { useEffect, useState } from 'react'
import { CheckSquare, FileText, CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { blink } from '../lib/blink'

interface Stats {
  totalTasks: number
  doneTasks: number
  inProgressTasks: number
  totalNotes: number
}

export default function DashboardPage({ userId }: { userId: string }) {
  const [stats, setStats] = useState<Stats>({ totalTasks: 0, doneTasks: 0, inProgressTasks: 0, totalNotes: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [tasks, notes] = await Promise.all([
          blink.db.tasks.list({ where: { userId } }),
          blink.db.notes.list({ where: { userId } }),
        ])
        setStats({
          totalTasks: tasks.length,
          doneTasks: tasks.filter((t: { status: string }) => t.status === 'done').length,
          inProgressTasks: tasks.filter((t: { status: string }) => t.status === 'in-progress').length,
          totalNotes: notes.length,
        })
      } catch (e) {
        // silent
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [userId])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const cards = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckSquare,
      color: 'text-primary',
      bg: 'bg-secondary',
    },
    {
      label: 'Completed',
      value: stats.doneTasks,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'In Progress',
      value: stats.inProgressTasks,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Notes',
      value: stats.totalNotes,
      icon: FileText,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
  ]

  const completionRate = stats.totalTasks > 0 ? Math.round((stats.doneTasks / stats.totalTasks) * 100) : 0

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-1">{greeting} 👋</h1>
        <p className="text-muted-foreground">Here's your productivity overview</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={card.label}
              className="bg-card rounded-2xl border border-border p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-fade-in"
              style={{ animationDelay: `${i * 75}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">
                {loading ? '—' : card.value}
              </p>
            </div>
          )
        })}
      </div>

      {/* Progress section */}
      {!loading && stats.totalTasks > 0 && (
        <div
          className="bg-card rounded-2xl border border-border p-6 shadow-sm mb-8 animate-fade-in"
          style={{ animationDelay: '350ms' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Task Completion</h2>
              <p className="text-sm text-muted-foreground">Overall progress this session</p>
            </div>
            <div className="flex items-center gap-1.5 text-primary">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">{completionRate}%</span>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${completionRate}%`,
                background: 'var(--gradient-primary)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">{stats.doneTasks} done</span>
            <span className="text-xs text-muted-foreground">{stats.totalTasks - stats.doneTasks} remaining</span>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && stats.totalTasks === 0 && stats.totalNotes === 0 && (
        <div
          className="bg-secondary rounded-2xl border border-border p-8 text-center animate-scale-in"
          style={{ animationDelay: '350ms' }}
        >
          <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center mx-auto mb-4 shadow-sm">
            <AlertCircle className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Nothing here yet</h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            Head over to Tasks or Notes to start organizing your work and ideas.
          </p>
        </div>
      )}
    </div>
  )
}
