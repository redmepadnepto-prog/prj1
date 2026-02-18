import { useEffect, useState } from 'react'
import { Plus, CheckCircle2, Circle, Clock, Trash2, ChevronDown, AlertTriangle } from 'lucide-react'
import { blink } from '../lib/blink'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import toast from 'react-hot-toast'

type TaskStatus = 'todo' | 'in-progress' | 'done'
type TaskPriority = 'low' | 'medium' | 'high'

interface Task {
  id: string
  userId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  todo: { label: 'To Do', icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted' },
  'in-progress': { label: 'In Progress', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  done: { label: 'Done', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
}

const priorityConfig = {
  low: { label: 'Low', color: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  medium: { label: 'Medium', color: 'text-amber-600', dot: 'bg-amber-500' },
  high: { label: 'High', color: 'text-red-600', dot: 'bg-red-500' },
}

export default function TasksPage({ userId }: { userId: string }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState<TaskPriority>('medium')
  const [adding, setAdding] = useState(false)
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all')

  const loadTasks = async () => {
    try {
      const data = await blink.db.tasks.list({ where: { userId }, orderBy: { createdAt: 'desc' } })
      setTasks(data as Task[])
    } catch {
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadTasks() }, [userId])

  const addTask = async () => {
    if (!newTitle.trim()) return
    setAdding(true)
    const now = new Date().toISOString()
    const task: Task = {
      id: crypto.randomUUID(),
      userId,
      title: newTitle.trim(),
      description: '',
      status: 'todo',
      priority: newPriority,
      createdAt: now,
      updatedAt: now,
    }
    setTasks(prev => [task, ...prev])
    setNewTitle('')
    try {
      await blink.db.tasks.create(task)
      toast.success('Task added')
    } catch {
      setTasks(prev => prev.filter(t => t.id !== task.id))
      toast.error('Failed to add task')
    } finally {
      setAdding(false)
    }
  }

  const updateStatus = async (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t))
    try {
      await blink.db.tasks.update(id, { status, updatedAt: new Date().toISOString() })
    } catch {
      toast.error('Failed to update task')
      loadTasks()
    }
  }

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    try {
      await blink.db.tasks.delete(id)
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
      loadTasks()
    }
  }

  const filtered = filter === 'all' ? tasks : tasks.filter(t => t.status === filter)

  const filters: { id: TaskStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'todo', label: 'To Do' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'done', label: 'Done' },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in">
          <h1 className="text-3xl font-bold text-foreground mb-1">Tasks</h1>
          <p className="text-muted-foreground text-sm">{tasks.length} total tasks</p>
        </div>

        {/* Add task */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-sm mb-6 animate-fade-in" style={{ animationDelay: '75ms' }}>
          <div className="flex gap-3">
            <Input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 bg-background border-border focus-visible:ring-primary/30"
              onKeyDown={e => e.key === 'Enter' && addTask()}
            />
            <div className="relative">
              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as TaskPriority)}
                className="h-9 px-3 pr-8 rounded-lg border border-border bg-background text-sm text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            </div>
            <Button
              onClick={addTask}
              disabled={adding || !newTitle.trim()}
              className="gap-1.5 text-primary-foreground"
              style={{ background: 'var(--gradient-primary)', border: 'none' }}
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-4 animate-fade-in" style={{ animationDelay: '150ms' }}>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                filter === f.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 animate-scale-in">
            <AlertTriangle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No tasks here</p>
            <p className="text-sm text-muted-foreground/70 mt-1">
              {filter === 'all' ? 'Add your first task above' : 'Try a different filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filtered.map((task, i) => {
              const status = statusConfig[task.status]
              const priority = priorityConfig[task.priority]
              const StatusIcon = status.icon
              return (
                <div
                  key={task.id}
                  className={`group bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in ${
                    task.status === 'done' ? 'opacity-70' : ''
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    {/* Status cycle button */}
                    <button
                      onClick={() => {
                        const next: Record<TaskStatus, TaskStatus> = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' }
                        updateStatus(task.id, next[task.status])
                      }}
                      className={`shrink-0 ${status.color} hover:scale-110 transition-transform duration-150`}
                      title={`Status: ${status.label}`}
                    >
                      <StatusIcon className="w-5 h-5" />
                    </button>

                    {/* Task info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium text-foreground ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`inline-flex items-center gap-1.5 text-xs ${priority.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
                          {priority.label}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="shrink-0 w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
