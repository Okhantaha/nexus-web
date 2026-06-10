import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: localStorage.getItem('nexus_token'),
      user: null,
      setAuth: (token, user) => {
        localStorage.setItem('nexus_token', token)
        set({ token, user })
      },
      clearAuth: () => {
        localStorage.removeItem('nexus_token')
        set({ token: null, user: null })
      },
      isAuthenticated: () => !!get().token,
    }),
    { name: 'nexus-auth', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
)
