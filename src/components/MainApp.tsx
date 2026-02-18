import { ShieldCheck, Infinity, Key, Zap, Globe, Lock, LogOut } from 'lucide-react'

interface MainAppProps {
  onDeactivate?: () => void
}

export default function MainApp({ onDeactivate }: MainAppProps) {
  const handleLogout = () => {
    localStorage.removeItem('dentyuss_key_activated')
    onDeactivate?.()
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden grid-bg">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(195 100% 50%) 0%, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-60 -right-60 w-[700px] h-[700px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(265 90% 65%) 0%, transparent 70%)' }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: 'hsl(228 18% 16%)' }}>
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(265 90% 65% / 0.2))',
              border: '1px solid hsl(195 100% 50% / 0.3)',
            }}
          >
            <Key className="w-4 h-4" style={{ color: 'hsl(195 100% 50%)' }} />
          </div>
          <span className="text-lg font-bold tracking-tight shimmer-text">DENTYUSS</span>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg transition-all duration-200 hover:opacity-80"
          style={{
            color: 'hsl(220 8% 50%)',
            background: 'hsl(228 18% 14%)',
            border: '1px solid hsl(228 18% 20%)',
          }}
        >
          <LogOut className="w-3.5 h-3.5" />
          Выйти
        </button>
      </header>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">
        {/* Success badge */}
        <div className="animate-bounce-in mb-8">
          <div
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, hsl(145 80% 40% / 0.2), hsl(195 100% 50% / 0.2))',
              border: '1px solid hsl(145 80% 50% / 0.4)',
            }}
          >
            <ShieldCheck className="w-12 h-12" style={{ color: 'hsl(145 80% 55%)' }} />
          </div>
        </div>

        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
            Ключ активирован
          </h1>
          <p className="text-base" style={{ color: 'hsl(220 8% 55%)' }}>
            Добро пожаловать в <span className="shimmer-text font-semibold">DENTYUSS</span>
          </p>
        </div>

        {/* Status card */}
        <div className="glass-card rounded-2xl p-6 sm:p-8 w-full max-w-lg mb-6 animate-fade-in">
          <h2 className="text-sm font-semibold uppercase tracking-widest mb-5"
            style={{ color: 'hsl(195 100% 50%)' }}>
            Статус лицензии
          </h2>

          <div className="space-y-4">
            {[
              {
                icon: <Key className="w-4 h-4" />,
                label: 'Ключ',
                value: 'DENTYUSS',
                mono: true,
              },
              {
                icon: <Infinity className="w-4 h-4" />,
                label: 'Срок действия',
                value: 'Навсегда ♾️',
              },
              {
                icon: <Globe className="w-4 h-4" />,
                label: 'Устройства',
                value: 'Неограниченно',
              },
              {
                icon: <Lock className="w-4 h-4" />,
                label: 'Статус',
                value: 'Активен ✓',
                green: true,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between py-3 border-b"
                style={{ borderColor: 'hsl(228 18% 16%)' }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: 'hsl(195 100% 50%)' }}>{item.icon}</span>
                  <span className="text-sm" style={{ color: 'hsl(220 8% 55%)' }}>{item.label}</span>
                </div>
                <span
                  className={`text-sm font-semibold ${item.mono ? 'font-mono tracking-wider' : ''}`}
                  style={{
                    color: item.green
                      ? 'hsl(145 80% 55%)'
                      : item.mono
                      ? 'hsl(195 100% 65%)'
                      : 'hsl(220 15% 88%)',
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg animate-fade-in">
          {[
            {
              icon: <Zap className="w-5 h-5" />,
              title: 'Мгновенный доступ',
              desc: 'Активация без задержек',
            },
            {
              icon: <Globe className="w-5 h-5" />,
              title: 'Все устройства',
              desc: 'Без ограничений по числу',
            },
            {
              icon: <ShieldCheck className="w-5 h-5" />,
              title: 'Вечная лицензия',
              desc: 'Ключ действует навсегда',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="glass-card rounded-xl p-4 text-center transition-all duration-200 hover:scale-[1.02]"
            >
              <div
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg mb-3"
                style={{
                  background: 'hsl(195 100% 50% / 0.1)',
                  color: 'hsl(195 100% 50%)',
                }}
              >
                {card.icon}
              </div>
              <p className="text-xs font-semibold mb-1" style={{ color: 'hsl(220 15% 88%)' }}>
                {card.title}
              </p>
              <p className="text-xs" style={{ color: 'hsl(220 8% 45%)' }}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
