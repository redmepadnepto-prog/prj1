import { useEffect, useState } from 'react'
import { Plus, Trash2, FileText, Search } from 'lucide-react'
import { blink } from '../lib/blink'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import toast from 'react-hot-toast'

type NoteColor = 'default' | 'amber' | 'rose' | 'violet' | 'emerald'

interface Note {
  id: string
  userId: string
  title: string
  content: string
  color: NoteColor
  createdAt: string
  updatedAt: string
}

const colorConfig: Record<NoteColor, { bg: string; border: string; title: string }> = {
  default: { bg: 'bg-card', border: 'border-border', title: 'text-foreground' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', title: 'text-amber-900' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', title: 'text-rose-900' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', title: 'text-violet-900' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', title: 'text-emerald-900' },
}

const colorDots: { id: NoteColor; dot: string }[] = [
  { id: 'default', dot: 'bg-muted-foreground' },
  { id: 'amber', dot: 'bg-amber-400' },
  { id: 'rose', dot: 'bg-rose-400' },
  { id: 'violet', dot: 'bg-violet-400' },
  { id: 'emerald', dot: 'bg-emerald-400' },
]

export default function NotesPage({ userId }: { userId: string }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showNew, setShowNew] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newContent, setNewContent] = useState('')
  const [newColor, setNewColor] = useState<NoteColor>('default')

  const loadNotes = async () => {
    try {
      const data = await blink.db.notes.list({ where: { userId }, orderBy: { updatedAt: 'desc' } })
      setNotes(data as Note[])
    } catch {
      toast.error('Failed to load notes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadNotes() }, [userId])

  const createNote = async () => {
    if (!newTitle.trim()) return
    const now = new Date().toISOString()
    const note: Note = {
      id: crypto.randomUUID(),
      userId,
      title: newTitle.trim(),
      content: newContent.trim(),
      color: newColor,
      createdAt: now,
      updatedAt: now,
    }
    setNotes(prev => [note, ...prev])
    setNewTitle('')
    setNewContent('')
    setNewColor('default')
    setShowNew(false)
    try {
      await blink.db.notes.create(note)
      toast.success('Note saved')
    } catch {
      setNotes(prev => prev.filter(n => n.id !== note.id))
      toast.error('Failed to save note')
    }
  }

  const updateNote = async (id: string, changes: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...changes, updatedAt: new Date().toISOString() } : n))
    try {
      await blink.db.notes.update(id, { ...changes, updatedAt: new Date().toISOString() })
    } catch {
      toast.error('Failed to update note')
    }
  }

  const deleteNote = async (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id))
    try {
      await blink.db.notes.delete(id)
      toast.success('Note deleted')
    } catch {
      toast.error('Failed to delete note')
      loadNotes()
    }
  }

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex-1 overflow-y-auto p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Notes</h1>
          <p className="text-muted-foreground text-sm">{notes.length} notes</p>
        </div>
        <Button
          onClick={() => setShowNew(true)}
          className="gap-1.5 text-primary-foreground"
          style={{ background: 'var(--gradient-primary)', border: 'none' }}
        >
          <Plus className="w-4 h-4" />
          New note
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 animate-fade-in" style={{ animationDelay: '75ms' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="pl-9 bg-card border-border focus-visible:ring-primary/30"
        />
      </div>

      {/* New note form */}
      {showNew && (
        <div className="bg-card rounded-2xl border-2 border-primary/30 p-5 shadow-md mb-6 animate-scale-in">
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Note title..."
            className="w-full text-base font-semibold text-foreground bg-transparent outline-none placeholder:text-muted-foreground mb-3 font-serif"
          />
          <textarea
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="Write something..."
            rows={4}
            className="w-full text-sm text-foreground bg-transparent outline-none resize-none placeholder:text-muted-foreground leading-relaxed"
          />
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              {colorDots.map(c => (
                <button
                  key={c.id}
                  onClick={() => setNewColor(c.id)}
                  className={`w-5 h-5 rounded-full ${c.dot} transition-transform duration-150 ${newColor === c.id ? 'scale-125 ring-2 ring-offset-1 ring-primary' : 'hover:scale-110'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => { setShowNew(false); setNewTitle(''); setNewContent('') }}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={createNote}
                disabled={!newTitle.trim()}
                className="text-primary-foreground"
                style={{ background: 'var(--gradient-primary)', border: 'none' }}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Notes grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-muted rounded-2xl animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 animate-scale-in">
          <FileText className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">
            {search ? 'No matching notes' : 'No notes yet'}
          </p>
          <p className="text-sm text-muted-foreground/70 mt-1">
            {search ? 'Try a different search term' : 'Create your first note above'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note, i) => {
            const colors = colorConfig[note.color as NoteColor] || colorConfig.default
            const isEditing = editingId === note.id
            return (
              <div
                key={note.id}
                className={`group relative rounded-2xl border ${colors.bg} ${colors.border} p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 animate-fade-in`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Delete button */}
                <button
                  onClick={() => deleteNote(note.id)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-150"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {/* Note content */}
                {isEditing ? (
                  <>
                    <input
                      autoFocus
                      defaultValue={note.title}
                      onBlur={e => updateNote(note.id, { title: e.target.value })}
                      className={`w-full text-sm font-semibold ${colors.title} bg-transparent outline-none mb-2 font-serif pr-8`}
                    />
                    <textarea
                      defaultValue={note.content}
                      rows={4}
                      onBlur={e => { updateNote(note.id, { content: e.target.value }); setEditingId(null) }}
                      className="w-full text-xs text-foreground bg-transparent outline-none resize-none leading-relaxed"
                    />
                  </>
                ) : (
                  <button className="w-full text-left" onClick={() => setEditingId(note.id)}>
                    <p className={`text-sm font-semibold ${colors.title} mb-2 pr-8 font-serif line-clamp-2`}>{note.title}</p>
                    {note.content && (
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">{note.content}</p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-3">
                      {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
