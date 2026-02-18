import { blink } from '../lib/blink'
import { CheckCircle, Zap, FileText, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'

const features = [
  {
    icon: CheckCircle,
    title: 'Smart Task Management',
    desc: 'Organize tasks with priorities, statuses, and a clean workflow that keeps you focused.',
    delay: '0ms',
  },
  {
    icon: FileText,
    title: 'Quick Notes',
    desc: 'Capture ideas and information instantly. Color-coded notes that are always within reach.',
    delay: '100ms',
  },
  {
    icon: Zap,
    title: 'Streamlined Productivity',
    desc: 'A unified workspace designed to reduce friction and amplify what you accomplish daily.',
    delay: '200ms',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm"
            style={{ background: 'var(--gradient-primary)' }}
          >
            К
          </div>
          <span className="font-serif font-semibold text-foreground text-lg tracking-tight">
            Ku Helper
          </span>
        </div>
        <Button
          onClick={() => blink.auth.login(window.location.href)}
          variant="outline"
          size="sm"
          className="border-border hover:bg-secondary hover:border-primary/30 transition-all duration-200"
        >
          Sign in
        </Button>
      </header>

      {/* Hero */}
      <main className="relative max-w-6xl mx-auto px-6 pt-16 pb-24">
        {/* Background decoration */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{ background: 'var(--gradient-primary)' }}
        />
        <div className="absolute top-32 left-1/4 w-72 h-72 rounded-full opacity-5 blur-3xl pointer-events-none bg-accent" />

        <div className="relative text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border text-sm text-secondary-foreground mb-8 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium">Your personal productivity companion</span>
          </div>

          <h1
            className="text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1] animate-slide-up"
            style={{ animationDelay: '50ms' }}
          >
            Get more done
            <br />
            <span
              className="bg-clip-text"
              style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              with less effort
            </span>
          </h1>

          <p
            className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up"
            style={{ animationDelay: '150ms' }}
          >
            Ku Helper brings your tasks, notes, and daily workflow into one beautiful, intuitive workspace. Designed for clarity — built for results.
          </p>

          <div
            className="flex items-center justify-center gap-4 animate-slide-up"
            style={{ animationDelay: '250ms' }}
          >
            <Button
              onClick={() => blink.auth.login(window.location.href)}
              size="lg"
              className="gap-2 px-7 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
              style={{ background: 'var(--gradient-primary)', border: 'none' }}
            >
              Get started free
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => blink.auth.login(window.location.href)}
              variant="ghost"
              size="lg"
              className="text-muted-foreground hover:text-foreground"
            >
              Sign in instead
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-5 mt-20">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: f.delay }}
              >
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors duration-200">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-base">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Social proof */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
          <p className="text-sm text-muted-foreground">
            Simple, powerful, and free to get started
          </p>
        </div>
      </main>
    </div>
  )
}
