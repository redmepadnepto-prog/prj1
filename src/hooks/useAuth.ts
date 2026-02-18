import { useState, useEffect } from 'react'
import { blink } from '../lib/blink'

interface AuthState {
  user: { id: string; email: string; displayName?: string } | null
  isLoading: boolean
  isAuthenticated: boolean
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((authState) => {
      setState({
        user: authState.user as AuthState['user'],
        isLoading: authState.isLoading,
        isAuthenticated: authState.isAuthenticated,
      })
    })
    return unsubscribe
  }, [])

  return state
}
