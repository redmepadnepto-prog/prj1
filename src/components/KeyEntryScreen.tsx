import { useState, useRef, useEffect } from 'react'
import { Loader2, KeyRound, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react'

const VALID_KEY = 'DENTYUSS'

interface KeyEntryScreenProps {
  onActivate: () => void
}

export default function KeyEntryScreen({ onActivate }: KeyEntryScreenProps) {
  const [value, setValue] = useState('')
  const [status, setStatus] = useState<'idle' | 'checking' | 'error' | 'success'>('idle')
  const [shake, setShake] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!value.trim()) return

    setStatus('checking')
    await new Promise(r => setTimeout(r, 900))

    if (value.trim().toUpperCase() === VALID_KEY) {
      setStatus('success')
      setTimeout(() => {
        localStorage.setItem('dentyuss_key_activated', 'true')
        onActivate()
      }, 1200)
    } else {
      setStatus('error')
      setShake(true)
      setTimeout(() => {
        setShake(false)
        setStatus('idle')
      }, 700)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'checking' || status === 'success') return
    setValue(e.target.value)
    if (status === 'error') setStatus('idle')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden grid-bg">
      {/* Background glow orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, hsl(195 100% 50%) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, hsl(265 90% 65%) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Card */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 animate-fade-in-scale ${shake ? 'shake' : ''}`}
        style={shake ? { animation: 'shakeX 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both' } : {}}
      >
        <div className="glass-card rounded-2xl p-8 sm:p-10">
          {/* Logo / header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 animate-float"
              style={{
                background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.2), hsl(265 90% 65% / 0.2))',
                border: '1px solid hsl(195 100% 50% / 0.3)',
                boxShadow: '0 0 24px hsl(195 100% 50% / 0.2)',
              }}>
              <KeyRound className="w-8 h-8" style={{ color: 'hsl(195 100% 50%)' }} />
            </div>

            <h1 className="text-4xl font-bold tracking-tight mb-1">
              <span className="shimmer-text">DENTYUSS</span>
            </h1>
            <p className="text-sm mt-2" style={{ color: 'hsl(220 8% 50%)' }}>
              Система лицензионных ключей
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex gap-2 justify-center mb-8 flex-wrap">
            {['∞ Устройств', '♾️ Навсегда', '🛡 Безопасно'].map((label) => (
              <span
                key={label}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: 'hsl(195 100% 50% / 0.1)',
                  border: '1px solid hsl(195 100% 50% / 0.2)',
                  color: 'hsl(195 100% 65%)',
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="license-key"
                className="block text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: 'hsl(195 100% 50%)' }}
              >
                Введите лицензионный ключ
              </label>

              <div className={`neon-border rounded-xl transition-all duration-300 ${status === 'error' ? 'border-red-500/60 shadow-[0_0_16px_hsl(0_72%_55%/0.25)]' : ''} ${status === 'success' ? 'border-emerald-400/60 shadow-[0_0_16px_hsl(145_80%_50%/0.25)]' : ''}`}>
                <input
                  ref={inputRef}
                  id="license-key"
                  type="text"
                  className="key-input w-full px-4 py-3.5 text-base rounded-xl"
                  style={{ color: 'hsl(220 15% 90%)' }}
                  placeholder="Ваш ключ DENTYUSS..."
                  value={value}
                  onChange={handleChange}
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                  disabled={status === 'checking' || status === 'success'}
                  maxLength={32}
                />
              </div>

              {/* Error message */}
              {status === 'error' && (
                <div className="flex items-center gap-2 mt-2 animate-fade-in">
                  <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400">Неверный ключ. Попробуйте снова.</p>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!value.trim() || status === 'checking' || status === 'success'}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: status === 'success'
                  ? 'linear-gradient(135deg, hsl(145 80% 40%), hsl(160 80% 45%))'
                  : 'linear-gradient(135deg, hsl(195 100% 40%), hsl(195 100% 50%))',
                color: 'hsl(230 25% 6%)',
                boxShadow: status === 'success'
                  ? '0 0 24px hsl(145 80% 45% / 0.4)'
                  : '0 0 24px hsl(195 100% 50% / 0.35)',
              }}
              onMouseEnter={e => {
                if (status !== 'checking' && status !== 'success') {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 36px hsl(195 100% 50% / 0.55)'
                  ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px hsl(195 100% 50% / 0.35)'
                ;(e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)'
              }}
            >
              {status === 'checking' && <Loader2 className="w-4 h-4 animate-spin" />}
              {status === 'success' && <ShieldCheck className="w-4 h-4" />}
              {status === 'idle' || status === 'error' ? <Sparkles className="w-4 h-4" /> : null}

              {status === 'checking' && 'Проверка...'}
              {status === 'success' && 'Активировано!'}
              {(status === 'idle' || status === 'error') && 'Активировать ключ'}
            </button>
          </form>

          {/* Footer hint */}
          <p className="text-center text-xs mt-6" style={{ color: 'hsl(220 8% 40%)' }}>
            Ключ действует <strong style={{ color: 'hsl(195 100% 50%)' }}>навсегда</strong> на{' '}
            <strong style={{ color: 'hsl(195 100% 50%)' }}>неограниченном</strong> числе устройств
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-3px); }
          90%       { transform: translateX(3px); }
        }
      `}</style>
    </div>
  )
}
